import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import styles from './MainLayout.less';

const MainLayout = ({ children }) => {
  return (
    <div className={styles.normal}>
      <div className={styles.head}>
        <div className={styles.logo}>
          LOGO
        </div>
        <div className={styles.menu}>
          <div className={styles['menu-item']}>
            <Link to="/">普通版</Link>
          </div>
          <div className={styles['menu-item']}>
            <Link to="/advanced">进阶版</Link>
          </div>
        </div>
        <div className={styles['menu-about']}>
          <div className={styles['menu-item']}>
            <Link to="/about">关于</Link>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          {children}
        </div>
      </div>
      <div className={styles.foot}>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
