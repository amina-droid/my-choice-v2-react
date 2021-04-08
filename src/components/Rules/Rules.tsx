import React, { FC, useContext, useMemo, useState } from 'react';
import { Button, Modal, Typography } from 'antd';

import s from './Rules.module.sass';

type RulesProps = {
  closeModal: () => void;
  visible: boolean;
}

type RulesState = {
  block?: BlockTypes;
  setBlock: (block?: BlockTypes) => void
}
const RulesContext = React.createContext<RulesState>({
  setBlock: () => {},
});

const useRulesContext = () => useContext(RulesContext);

type BlockTypes = 'inner' | 'outer' | 'circles' | 'resources' | 'process'

const NavButton: FC<{ to?: BlockTypes }> = ({
  children,
  to,
}) => {
  const { setBlock } = useRulesContext();
  return (
    <Button type="link" className={s.navButton} onClick={() => setBlock(to)}>{children}</Button>
  );
};

const MainNavigation: FC = () => (
  <Paragraph>
    Навигация
    <ol>
      <li>
        <NavButton
          to="circles"
        >
          Внутренний и внешний игровые круги
        </NavButton>
      </li>
      <li>
        <NavButton
          to="resources"
        >
          Ресурсы
        </NavButton>
      </li>
      <li>
        <NavButton
          to="process"
        >
          Игровой процесс
        </NavButton>
      </li>
    </ol>
  </Paragraph>
);

const CirclesBlock = () => (
  <Paragraph>
    <ol>
      <li>
        <NavButton
          to="inner"
        >
          Внутренний игровой круг.
        </NavButton>
      </li>
      <Paragraph>
        С него начинается игра. Вам предстоит,
        кидая кубик передвигать вашу фишку на соответствующее деление (поле)
        внутреннего круга, попадая в различные игровые ситуации и принимая решения.
      </Paragraph>
      <li>
        <NavButton
          to="outer"
        >
          Внешний игровой круг.
        </NavButton>
      </li>
      <Paragraph>
        Кидаете кубик и двигаетесь по часовой стрелке, начиная с поля,
        к которому ведет указатель от поля «Возможность»
        с которого вы собираетесь перейти на внешний круг.
        Таким образом, если вы можете перейти на внешний круг,
        оказавшись на поле «Возможность», вы за один раз делаете два хода
        (один на внутреннем круге до клетки «Возможность» и один на внешнем,
        начиная с клетки, на которую указывает указатель).
      </Paragraph>
    </ol>
  </Paragraph>
);

const MainBlock = () => (
  <>
    <Title level={5}>Дорогие друзья!</Title>
    <Paragraph>Игра, которая сейчас перед вами,
      это уникальная возможность посмотреть,
      как можно добиться своих целей и достичь успеха в жизни не только при помощи денег.
      Она поможет вам освоить и применить еще один вид ресурса,
      который есть у каждого, но работать с которым умеют далеко не все.
    </Paragraph>
    <Title level={5}>Этот ресурс – социальный капитал. Вы, конечно, спросите, что это?</Title>
    <Paragraph>Все просто! В то время как
      физический капитал относится к физическим объектам, а человеческий капитал
      соотносится со свойствами отдельных личностей ( ваши знания и умения),
      социальный капитал касается связей между людьми – социальных сетей,
      норм взаимодействия и доверия, возникающих в таких отношениях.
      В этом смысле социальный капитал тесно связан с тем,
      что мы называем «гражданским достоинством».
      Социальный капитал – это взаимодействие людей между собой,
      которое позволяет создавать сообщества, поддерживать друг друга,
      создавая социальную ткань.
      Социальный капитал - это чувство принадлежности к социуму и опыт жизни в
      социальных отношениях (доверие и толерантность).
      Доверие между отдельными людьми может стать и доверием между незнакомцами,
      позволяет человеку войти в широкую ткань социальных институтов;
      наконец, оно становится широким набором ценностей,
      благ и ожиданий во всем обществе. Без такого взаимодействия,
      доверие падает; в определенный момент оно может упасть до такой степени,
      что создает серьезные социальные проблемы.
    </Paragraph>
    <Paragraph>
      Как все это работает и работает ли вообще?
      Оценить это самостоятельно и сделать собственные выводы позволит вам игра «Мой выбор».
    </Paragraph>
  </>
);

const Blocks: FC = () => {
  const { block } = useRulesContext();
  switch (block) {
    case 'circles': {
      return <CirclesBlock />;
    }
    default: {
      return (
        <>
          <MainBlock />
          <MainNavigation />
        </>
      );
    }
  }
};

export const RulesContextProvider: FC = ({ children }) => {
  const [visibleBlock, setVisibleBlock] = useState<BlockTypes>();
  const context = useMemo<RulesState>(() => ({
    block: visibleBlock,
    setBlock: setVisibleBlock,
  }), [visibleBlock]);

  return (
    <RulesContext.Provider value={context}>
      {children}
    </RulesContext.Provider>
  );
};

const { Title, Paragraph } = Typography;
const Rules: FC<RulesProps> = ({ closeModal, visible }) => (
  <Modal
    title="Правила игры"
    closable={false}
    onCancel={closeModal}
    footer={null}
    width={800}
    visible={visible}
    className={s.modalContent}
  >
    <Blocks />
  </Modal>
);

export default Rules;
