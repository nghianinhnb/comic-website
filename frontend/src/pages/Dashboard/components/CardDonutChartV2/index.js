import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
CardDonutChartV2.propTypes = {
  additionalClassName: PropTypes.string,
  chartSeries: PropTypes.array,
  chartLabels: PropTypes.array,
  title: PropTypes.string,
  chartColors: PropTypes.array,
  additonalElement: PropTypes.element,
  loading: PropTypes.bool,
};

CardDonutChartV2.defaultProps = {
  additionalClassName: '',
  chartSeries: [],
  chartLabels: [],
  title: '',
  chartColors: AppData.chartColors,
  additonalElement: <></>,
  loading: false,
};

/**
 *
 * @param {{
 * additionalClassName: string,
 * chartLabels: string[],
 * chartSeries: number[],
 * title: string,
 * }} props
 * @returns
 */
function CardDonutChartV2(props) {
  // MARK: --- Params ---
  const {
    additionalClassName,
    chartLabels,
    chartSeries,
    title,
    chartColors,
    additonalElement,
    loading,
  } = props;
  const { t } = useTranslation();
  const options = useMemo(
    () => ({
      // responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    }),
    [chartLabels]
  );

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: '',
        data: chartSeries,
        backgroundColor: chartColors,
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="CardDonutChartV2 h-100">
      <div className={`card card-custom card-stretch gutter-b ${additionalClassName}`}>
        {/* card header */}
        <div className="card-header border-0 pt-6 d-flex flex-wrap align-items-center justify-content-between">
          <h3 className="card-title mb-4">
            <span className="card-label font-weight-bolder font-size-h4 text-dark-75">{title}</span>
          </h3>
          <div className="mb-4">{additonalElement}</div>
        </div>

        {/* card body */}
        <div className="card-body d-flex align-items-center justify-content-center pb-7 pt-0 flex-wrap">
          <div className="w-100">
            {loading ? (
              <div className="d-flex aligin-items-center justify-content-center">
                <Loading showBackground={false} />
              </div>
            ) : chartSeries.length > 0 || !chartSeries?.every((item) => (item = 0)) ? (
              <Doughnut options={options} data={data} />
            ) : (
              <div className="pt-12">
                <Empty
                  text={t('NoData')}
                  visible={false}
                  imageEmpty={AppResource.icons.icEmptyBox}
                  imageEmptyPercentWidth={50}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDonutChartV2;
