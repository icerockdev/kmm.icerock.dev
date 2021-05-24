import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Коллекция материалов',
    Svg: require('../../static/img/feature-1.svg').default,
    description: (
      <>
        В разделе Documentation собрана коллекция материалов для изучения
        Kotlin Multiplatform Mobile. Статьи, видео записи, презентации и 
        примеры кода.
      </>
    ),
  },
  {
    title: 'Курс обучения',
    Svg: require('../../static/img/feature-2.svg').default,
    description: (
      <>
        Специально для сотрудников IceRock Development и для всех интересующихся
        в разделе Onboarding можно пройти курс обучения, состоящий из статей и
        практических занятий в виде CodeLabs.
      </>
    ),
  },
  {
    title: 'Сделано в IceRock',
    Svg: require('../../static/img/feature-3.svg').default,
    description: (
      <>
        Материалы собраны сотрудниками IceRock Development, но доступны на GitHub и
        любая помощь в развитии всегда приветствуется.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
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
