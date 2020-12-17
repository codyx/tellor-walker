import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import {
  hashCode,
  intToRGB,
} from '../../utils/helpers';

const columns = [
  {
    title: 'Tellor ID',
    dataIndex: 'tellorId',
    key: 'tellorId',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Value Count',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Last Value',
    dataIndex: 'data',
    key: 'data',
  },
  {
    title: 'Median (Last 5 Values)',
    dataIndex: 'median',
    key: 'median',
  },
  {
    title: 'Average (Last 5 Values)',
    dataIndex: 'avg',
    key: 'avg',
  },
  {
    title: 'Last 5 Timestamps Values',
    dataIndex: 'chart',
    key: 'chart',
    render: (values) => {
      // console.log('chart render values', values);
      const data = values.map(({ idx, value }) => ({
        title: idx,
        value,
        color: `#${intToRGB(hashCode(value.toString()))}`,
      }));
      return (
        <PieChart
          data={data}
          label={({ dataEntry }) => dataEntry.value}
          labelStyle={(index) => ({
            fill: data[index].color,
            fontSize: '8px',
            fontFamily: 'sans-serif',
          })}
          radius={42}
          labelPosition={112}
          animate
        />
      );
    },
  },
];

export default columns;
