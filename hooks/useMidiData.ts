import { useEffect, useState } from "react";
import { Midi } from "@tonejs/midi";
import { MidiTrack } from "@/data/projects";

export interface ParsedNote {
  midi: number;        // MIDI note number (0-127)
  time: number;        // Start time in seconds
  duration: number;    // Duration in seconds
  velocity: number;    // Velocity (0-1)
  color: string;       // Track color
}

export interface MidiData {
  notes: ParsedNote[];
  minPitch: number;
  maxPitch: number;
  duration: number;
}

export function useMidiData(midiTracks?: MidiTrack[]): MidiData | null {
  const [midiData, setMidiData] = useState<MidiData | null>(null);

  useEffect(() => {
    if (!midiTracks || midiTracks.length === 0) {
      setMidiData(null);
      return;
    }

    const loadMidiData = async () => {
      try {
        const allNotes: ParsedNote[] = [];
        let minPitch = 127;
        let maxPitch = 0;
        let maxDuration = 0;

        // Fetch and parse all MIDI tracks
        for (const track of midiTracks) {
          const response = await fetch(track.url);
          const arrayBuffer = await response.arrayBuffer();
          const midi = new Midi(arrayBuffer);

          // Extract notes from all tracks in the MIDI file
          midi.tracks.forEach((midiTrack) => {
            midiTrack.notes.forEach((note) => {
              allNotes.push({
                midi: note.midi,
                time: note.time,
                duration: note.duration,
                velocity: note.velocity,
                color: track.color,
              });

              // Update pitch range
              minPitch = Math.min(minPitch, note.midi);
              maxPitch = Math.max(maxPitch, note.midi);

              // Update duration
              maxDuration = Math.max(maxDuration, note.time + note.duration);
            });
          });
        }

        // Add 6 semitone padding
        const paddedMinPitch = Math.max(0, minPitch - 6);
        const paddedMaxPitch = Math.min(127, maxPitch + 6);

        setMidiData({
          notes: allNotes,
          minPitch: paddedMinPitch,
          maxPitch: paddedMaxPitch,
          duration: maxDuration,
        });
      } catch (error) {
        console.error("Error loading MIDI data:", error);
        setMidiData(null);
      }
    };

    loadMidiData();
  }, [midiTracks]);

  return midiData;
}
