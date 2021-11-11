import React from 'react';
import { FormattedMessage } from 'react-intl';

import Wrapper from './Wrapper';
import AnimatedWrapper from './AnimatedWrapper';
import Title from './Title';
import SubTitle from './SubTitle';
import messages from './messages';

function Header() {
  return (
    <div>
      <Wrapper>
        <AnimatedWrapper>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <Title>
            <FormattedMessage {...messages.title} />
          </Title>
          <SubTitle>
            <FormattedMessage {...messages.subtitle} />
            <strike>
              <FormattedMessage {...messages.subtitleStrikeout} />
            </strike>
          </SubTitle>
        </AnimatedWrapper>
      </Wrapper>
    </div>
  );
}

export default Header;
