/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: "I'm Iris",
  },
  subtitle: {
    id: `${scope}.subtitle`,
    defaultMessage: 'I write programs ',
  },
  subtitleStrikeout: {
    id: `${scope}.subtitle.strikeout`,
    defaultMessage: 'and bugs.',
  },
});
