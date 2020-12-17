import React, { useState } from 'react';
import {
  Button, Checkbox, Divider, Input, Tag,
} from 'antd';
import { RadarChartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import indexes from '../../utils/tellor/indexes';

const CheckboxGroup = Checkbox.Group;

const DataPointsList = ({ DataPoints, setDataPoints }) => {
  // Default Tellor ID data points to fetch
  const getDefaultDataPoints = () => {
    if (typeof window === 'undefined') return [];
    const tellorOfficialDP = indexes.map((_, idx) => (idx + 1));

    const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
    const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];

    return [...new Set([...tellorOfficialDP, ...parsedArr])];
  };
  const getDefaultDataPointsAsStr = () => {
    if (typeof window === 'undefined') return [];

    const tellorOfficialDPAsStr = indexes.map((_, idx) => `${(idx + 1)}`);
    const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
    const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];
    const parsedArrAsStr = parsedArr.map((val) => `${val}`);

    const merge = [...new Set([...tellorOfficialDPAsStr, ...parsedArrAsStr])];
    return merge;
  };
  const plainOptions = getDefaultDataPointsAsStr();
  const defaultCheckedList = DataPoints.map((x) => x.toString());

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const makeTags = () => {
    const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
    const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];
    return parsedArr;
  };
  const [tags, setTags] = useState(makeTags()); // Tags === custom data points

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);

    // Update Data Points to fetch
    setDataPoints(list.map((x) => parseInt(x, 10)));
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    setDataPoints(e.target.checked ? getDefaultDataPoints() : []);
  };

  const handleChange = (e) => {
    const rule = /^[0-9]\d*$/g;
    let value = '';
    if (e.target.value.length) {
      if (!rule.test(e.target.value)) {
        // eslint-disable-next-line no-alert
        alert('Value must be a positive integer');
        return;
      }
      value = parseInt(e.target.value, 10);
      if (Number.isNaN(value)) {
        // eslint-disable-next-line no-alert
        alert('Value is not a number. Please change');
        return;
      }
    }
    setInputValue(value.toString());
  };

  const handleAdd = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
      const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];
      const dedupNewPointsArr = [...new Set([...parsedArr, inputValue])];
      // console.log('new dedupNewPointsArr', dedupNewPointsArr);
      window.localStorage.setItem('customDataPoints', JSON.stringify(dedupNewPointsArr));
    }
    setInputValue('');
    const newList = [...checkedList, inputValue];
    setCheckedList(newList);
    setTags([...tags, inputValue]);
    // Update Data Points to fetch
    setDataPoints(newList.map((x) => parseInt(x, 10)));
  };

  const deleteTag = (e, tag) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cachedCustomDataPoints = window.localStorage.getItem('customDataPoints');
      const parsedArr = cachedCustomDataPoints ? JSON.parse(cachedCustomDataPoints) : [];
      // console.log('new parsedArr before', parsedArr);
      const arrWithoutTag = parsedArr.filter((val) => val.toString() !== tag.toString());
      // console.log('new arrWithoutTag after', arrWithoutTag);
      window.localStorage.setItem('customDataPoints', JSON.stringify(arrWithoutTag));
      setTags(arrWithoutTag);
      const newList = checkedList.filter((val) => val.toString() !== tag.toString());
      setCheckedList(newList);
      // Update Data Points to fetch
      setDataPoints(newList.map((x) => parseInt(x, 10)));
    } else e.preventDefault();
  };

  const unSelectAll = (e) => {
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    if (DataPoints !== []) { setDataPoints([]); }
  };

  return (
    <>
      {
        (checkedList.length < plainOptions.length) ? (
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            Select all
          </Checkbox>
        ) : (
          <Checkbox indeterminate={indeterminate} onChange={unSelectAll} checked={checkAll}>
            Unselect all
          </Checkbox>
        )
      }
      <Divider />
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
      <Divider />
      {tags.map((tag) => <Tag key={tag} closable onClose={(e) => deleteTag(e, tag)}>{tag}</Tag>)}
      <Divider />
      <p>Track a new data point</p>
      <Input
        size="small"
        placeholder="Data Point ID (uint256)"
        prefix={<RadarChartOutlined />}
        onChange={handleChange}
        value={inputValue}
      />
      <br />
      <Button
        type="primary"
        shape="round"
        icon={<PlusCircleOutlined />}
        size="small"
        style={{ marginTop: 15 }}
        onClick={handleAdd}
        disabled={inputValue.length === 0}
      >
        Add
      </Button>
    </>
  );
};

export default DataPointsList;
