import React, { cloneElement, Children, useState } from 'react';
import { Layout, Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styles from '../../styles/Home.module.css';
import SettingsModal from '../settings';
import indexes from '../../utils/tellor/indexes';

const { Header, Content, Footer } = Layout;

const LayoutComponent = ({ children }) => {
  const getDefaultDataPoints = () => {
    if (typeof window === 'undefined') return [];

    const tellorOfficialDP = indexes.map((_, idx) => (idx + 1));

    const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
    const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];

    return [...new Set([...tellorOfficialDP, ...parsedArr])];
  };
  const [visible, setVisible] = useState(false); // Settings modal
  const [DataPoints, setDataPoints] = useState(getDefaultDataPoints());
  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Header style={{
        zIndex: 1, width: '100%', height: '100%', backgroundColor: '#fff',
      }}
      >
        <Menu theme="light" mode="horizontal">
          <img
            src="/TellorWalker.png"
            alt="Tellor Walker"
            height="150px"
            width="150px"
          />
          <Menu.Item key="settings" onClick={() => setVisible(true)} icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <SettingsModal
            visible={visible}
            handleOk={() => setVisible(false)}
            handleCancel={() => setVisible(false)}
            DataPoints={DataPoints}
            setDataPoints={setDataPoints}
          />
        </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 0px', marginTop: 0 }}>
        <div className="site-layout-background" style={{ padding: 0, minHeight: 380 }}>
          {Children.map(children, (child) => (
            cloneElement(child, { DataPoints })
          ))}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <a
          href="https://github.com/codyx/tellor-walker"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="github.svg" alt="Tellor Walker GitHub" className={styles.logo} />
        </a>
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;
