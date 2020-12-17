import React from 'react';
import { Modal } from 'antd';
import DataPointsList from './DataPointsList';

const SettingsModal = ({
  visible, handleOk, handleCancel,
  DataPoints, setDataPoints,
}) => (
  <Modal
    title="Settings"
    visible={visible}
    onOk={handleOk}
    confirmLoading={false}
    onCancel={handleCancel}
  >
    <h3>Data Points Tracker</h3>
    <DataPointsList
      DataPoints={DataPoints}
      setDataPoints={setDataPoints}
    />
  </Modal>
);

export default SettingsModal;
