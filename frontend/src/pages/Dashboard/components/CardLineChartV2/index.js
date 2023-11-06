import AppData from 'general/constants/AppData';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import AppResource from 'general/constants/AppResource';
import { useTranslation } from 'react-i18next';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

CardLineChartV2.propTypes = {
  additionalClassName: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  chartSeries: PropTypes.array,
  chartLabels: PropTypes.array,
  toolbarElement: PropTypes.element,
  sideBarElement: PropTypes.element,
  chartColors: PropTypes.array,
  headerSidebar: PropTypes.element,
  loading: PropTypes.bool,
  fullChartLabels: PropTypes.array,
};

CardLineChartV2.defaultProps = {
  additionalClassName: '',
  title: '',
  subTitle: '',
  chartSeries: [],
  chartLabels: [],
  toolbarElement: null,
  sideBarElement: null,
  chartColors: AppData.chartColors,
  headerSidebar: null,
  loading: false,
  fullChartLabels: [],
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
function CardLineChartV2(props) {
  const {
    additionalClassName,
    title,
    subTitle,
    chartSeries,
    chartLabels,
    toolbarElement,
    sideBarElement,
    chartColors,
    headerSidebar,
    loading,
    fullChartLabels,
  } = props;

  const { t } = useTranslation();

  const options = useMemo(
    () => ({
      // responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value, index, ticks) {
              return fullChartLabels[index].slice(0, 2);
            },
          },
        },
      },
    }),
    [chartLabels]
  );

  const series = useMemo(() => {
    const result = [];
    for (let i = 0; i < chartSeries?.length; i++) {
      const seri = chartSeries[i];
      for (let i = 0; i < fullChartLabels.length; i++) {
        const index = chartLabels.indexOf(fullChartLabels[i]);
        if (index >= 0) {
          chartSeries[i]?.data[index]
            ? seri.data.push(chartSeries[i]?.data[index])
            : seri.data.push(0);
        } else {
          seri.data.push(0);
        }
      }
      result.push(seri);
    }

    return result;
  }, [chartSeries]);

  const data = useMemo(() => {
    return {
      labels: fullChartLabels,
      datasets: series.map((item, index) => {
        return {
          label: item.name,
          data: item.data,
          borderColor: chartColors[index],
          backgroundColor: chartColors[index],
          //   fill: 'start',
          //   backgroundColor: (context) => {
          //     const ctx = context.chart.ctx;
          //     const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          //     gradient.addColorStop(0, chartColors[index]);
          //     gradient.addColorStop(1, 'rgba(250,174,50,0)');
          //     return gradient;
          //   },
        };
      }),
    };
  }, [chartSeries, chartLabels]);

  const apexChartEl = useMemo(() => {
    return <Line options={options} data={data} />;
  }, [options, chartSeries]);

  return (
    <div
      className={`CardLineChartV2 h-100 bg-white rounded mb-8 ${
        sideBarElement ? 'row m-0 pr-0' : ''
      }`}
    >
      <div className={`${sideBarElement ? 'col-9' : ''}`}>
        <div className={`card-header px-6 border-0 pt-6 ${toolbarElement ? '' : 'pb-0'}`}>
          <div
            className={`${toolbarElement ? 'mb-6' : ''} ${
              headerSidebar ? 'd-flex flex-wrap align-items-center justify-content-between' : ''
            }`}
          >
            {/* card title */}
            <h3 className="card-title m-0">
              <span className="card-label font-weight-bolder font-size-h4 text-dark-75">
                {title}
              </span>
              <span className="d-block text-muted mt-2 font-size-base">{subTitle}</span>
            </h3>
            <div>{headerSidebar}</div>
          </div>
          {/* card toolbar */}
          {toolbarElement && <div className="card-toolbar">{toolbarElement}</div>}
        </div>
        {loading ? (
          <div className="d-flex aligin-items-center justify-content-center">
            <Loading showBackground={false} />
          </div>
        ) : chartSeries?.every((item) => item.data?.length > 0) ? (
          <div className="h-100 mb-8 pr-3 pl-6" style={{ minHeight: '280px' }}>
            {apexChartEl}
          </div>
        ) : (
          <div className="pt-12">
            <Empty
              text={t('NoData')}
              visible={false}
              imageEmpty={AppResource.icons.icEmptyBox}
              imageEmptyPercentWidth={40}
            />
          </div>
        )}
      </div>
      {sideBarElement && <div className="border-left col-3 px-0">{sideBarElement}</div>}
    </div>
  );
}

export default CardLineChartV2;
