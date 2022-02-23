import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Onboarding',
    Svg: require('../../static/img/feature-3.svg').default,
    description: (
      <>
        Инструкция по погружению в разработку с использованием Kotlin Multiplatform Mobile 
          специально для новых сотрудников IceRock Development.
        Предназначен для опытных разработчиков под Android или iOS.
      </>
    ),
  },
  {
    title: 'Knowledge Base',
    Svg: require('../../static/img/feature-1.svg').default,
    description: (
      <>
      Коллекция материалов для изучения Kotlin Multiplatform Mobile. 
      Статьи, видео записи, презентации и примеры кода.
      Собраны различные кейсы и полезные материалы из опыта работы с KMM начиная с 2018 года.
      </>
    ),
    className: "knowledgeFeature"
  },
  {
    title: 'University',
    Svg: require('../../static/img/feature-2.svg').default,
    description: (
      <>
        Курс обучения разработке под Android и iOS с использованием Kotlin Multiplatform Mobile. 
        Данный курс преподается в корпоративном университете IceRock и предназначен для начинающих разработчиков.
      </>
    ),
  },
];

function Feature({Svg, title, description, className}) {
  return (
    <div className={clsx('col col--4 ', className)}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
