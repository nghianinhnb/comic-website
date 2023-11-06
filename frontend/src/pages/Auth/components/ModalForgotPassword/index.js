// import lifeStyleApi from 'api/lifeStyleApi';
import { FastField, Formik } from 'formik';
import KTFormGroup from 'general/components/Forms/KTFormGroup';
import KTFormInput, { KTFormInputType } from 'general/components/Forms/KTFormInput';
// import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
// import KTFormInput, {
//   KTFormInputType,
// } from 'general/components/OtherKeenComponents/Forms/KTFormInput';
// import KTFormTextArea from 'general/components/OtherKeenComponents/Forms/KTFormTextArea';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

ModalForgotPassword.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,

  onExistDone: PropTypes.func,
};

ModalForgotPassword.defaultProps = {
  show: false,
  onClose: null,

  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalForgotPassword(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onExistDone } = props;

  // MARK: --- Functions ---
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleExistDone() {
    if (onExistDone) {
      onExistDone();
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: '',
        }}
        validationSchema={Yup.object({
          username: Yup.string().trim().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(formikProps) => (
          <>
            <Modal
              className=""
              show={show}
              backdrop="static"
              size="md"
              onHide={handleClose}
              centered
              onExit={() => {
                formikProps.handleReset();
              }}
              onExited={() => {
                handleExistDone();
              }}
            >
              <Modal.Header className="px-5 py-5">
                <Modal.Title>{t('Password retrieval')}</Modal.Title>
                <div
                  className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <i className="far fa-times"></i>
                </div>
              </Modal.Header>

              <Modal.Body
                className="overflow-auto"
                style={{
                  maxHeight: '70vh',
                }}
              >
                <div>
                  <div className="row">
                    {/* tieu de */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('MST/Email/Tên đăng nhập')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="username"
                        inputElement={
                          <FastField name="username">
                            {({ field, form, meta }) => (
                              <KTFormInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onFocus={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                type={KTFormInputType.text}
                                placeholder={`${_.capitalize(t('MST/Email/Tên đăng nhập'))}...`}
                                // disabled={!canEdit}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="w-100 d-flex row">
                  <Button
                    className="font-weight-bold flex-grow-1 col mr-3"
                    variant="secondary"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    {t('Close')}
                  </Button>

                  <Button
                    className="font-weight-bold flex-grow-1 col"
                    variant="primary"
                    onClick={() => {
                      formikProps.handleSubmit();
                    }}
                  >
                    {t('Password retrieval')}
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ModalForgotPassword;
