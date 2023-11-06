import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import GuestBaseLayout from 'general/components/eInvoiceComponents/BaseLayout/GuestBaseLayout';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BaseTextField from 'general/components/Forms/BaseTextField';
import { useHistory } from 'react-router-dom';
import CaptchaInput from 'general/components/CaptchaInput';
import { useState } from 'react';
import * as Yup from 'yup';
import Utils from 'general/utils/Utils';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import authApi from 'api/authApi';
import AppResource from 'general/constants/AppResource';

SignUpScreen.propTypes = {};

const sTag = '[SignUpScreen]';

function SignUpScreen(props) {
  // MARK --- Parmas: ---
  const { t } = useTranslation();
  const history = useHistory();
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');
  const [type, setType] = useState('ENTERPRISE');

  const formik = useFormik({
    initialValues: {
      accountType: 'ENTERPRISE',
      email: '',
      fullname: '',
      password: '',
      phone: '',
      taxCode: '',
      // confirm: true,
      captcha: '',
    },
    onSubmit: async (values) => {
      const params = {
        ...values,
      };
      console.log(params);
      setSavedEmail(values.email);
      delete params['confirm'];
      delete params['captcha'];
      if (params.accountType === 'PERSONAL') {
        delete params.taxCode;
      }
      let hashPassword = Utils.sha256(params.password);
      params.password = hashPassword;
      console.log(`${sTag} on submit: ${JSON.stringify(params)}`);
      try {
        const res = await authApi.signUp(params);
        if (res) {
          localStorage.setItem(PreferenceKeys.savedLoginEmail, values.email);
          localStorage.setItem(PreferenceKeys.savedLoginPassword, /*values.password*/ '');
          // ToastHelper.showSuccess('Đăng ký thành công, vui lòng vào email để kích hoạt tài khoản !!!');
          setShowNotiModal(true);
          // navigate('/sign-in');
        }
      } catch (err) {
        console.log(`${sTag} sign up account error: ${err.message}`);
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
      password: Yup.string()
        .required('Bạn chưa nhập mật khẩu')
        .min(6, 'Mật khẩu phải chứa ít nhất 6 kí tự')
        .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng'),
      fullname: Yup.string().required(`Bạn chưa nhập tên`),
      // confirm: Yup.boolean().test(
      //   'isTrue',
      //   'Bạn phải đồng ý với điều khoản của chúng tôi để tiếp tục',
      //   (value) => value === true
      // ),
      captcha: Yup.string().required('Vui lòng xác nhận bạn không phải là người máy'),
      phone: Yup.string()
        .trim()
        .matches(/(\+84|03|05|07|08|09)+([0-9]{8,15})\b/, 'Số điện thoại không hợp lệ'),
      taxCode:
        type === 'ENTERPRISE'
          ? Yup.string()
              .required('Bạn chưa nhập mã số thuế')
              .trim()
              .test('len', 'Mã số thuế chưa hợp lệ', (val) => {
                if (val) {
                  return (
                    !val.toString().includes(' ') &&
                    (val.toString().match(/^[0-9]{10}$/) ||
                      val.toString().match(/^[0-9]{10}-[0-9]{3}$/))
                  );
                }
              })
              .nullable()
          : null,
    }),
  });
  return (
    <GuestBaseLayout nonPadding={true}>
      <div className="LoginHomeScreen d-flex flex-grow-1 align-items-center">
        <div className="container-xl d-flex flex-column flex-lg-row justify-content-lg-between align-items-center">
          {/* title */}
          <div className="col-12 col-lg-7 d-flex flex-column justify-content-center py-20">
            <p
              className="font-weight-boldest text-white text-center text-lg-left"
              style={{ fontSize: '40px' }}
            >
              Giải pháp hóa đơn điện tử an toàn và thông minh
            </p>
            <p
              className="font-weight-boldest text-white text-center text-lg-left"
              style={{ fontSize: '15px' }}
            >
              Trải nghiệm sử dụng hóa đơn theo cách hoàn toàn mới. Chúng tôi tin tưởng bạn sẽ đạt
              được nhiều hơn những gì mong đợi. Hãy bắt đầu trải nghiệm ngay
            </p>
          </div>

          {/* log in card */}
          <div className="py-10 col-10 col-sm-8 col-lg-5 col-xxl-5 col-md-6 ">
            <Card className="">
              <Card.Header>
                <div>
                  <p
                    className="font-weight-bolder text-center m-0"
                    style={{ fontSize: 20, lineHeight: '32px', color: '#18214D' }}
                  >
                    Đăng ký tài khoản VIET INVOICE
                  </p>
                  <p
                    className="font-size-base font-weight-bolder text-center mt-3 mb-0"
                    style={{ lineHeight: '17px' }}
                  >
                    <span style={{ color: '#4A5677' }}>Bạn đã có tài khoản VIET INVOICE?</span>
                    <span
                      className="ms-3 cursor-pointer hover-opacity-60 text-primary"
                      // style={{ color: AppResource.colors.featureColor }}
                      onClick={() => {
                        history.push('/dang-nhap');
                      }}
                    >
                      ĐĂNG NHẬP
                    </span>
                  </p>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {/* account type */}
                {/* <div className="p-5 border-bottom">
                  <p
                    className="font-size-base font-weight-bolder"
                    style={{ color: '#4A5677', lineHeight: '17px' }}
                  >
                    Loại tài khoản <span className="text-danger">*</span>
                  </p>
                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <div className="d-flex flex-row align-items-center AppRadioButton">
                      <input
                        className="cursor-pointer mr-2"
                        checked={formik.values.accountType === 'ENTERPRISE'}
                        type="radio"
                        name="signUp"
                        id="ENTERPRISE"
                        onChange={() => {
                          formik.getFieldHelpers('accountType').setValue('ENTERPRISE');
                        }}
                        value="ENTERPRISE"
                      />
                      <label
                        className="m-0 font-size-base font-weight-bolder cursor-pointer"
                        style={{ color: '#4A5677', lineHeight: '17px' }}
                        htmlFor="ENTERPRISE"
                      >
                        Doanh nghiệp
                      </label>
                    </div>
                    <div className="ms-5 d-flex flex-row align-items-center AppRadioButton">
                      <input
                        className="cursor-pointer mr-2"
                        type="radio"
                        name="signUp"
                        id="PERSONAL"
                        onChange={() => {
                          formik.getFieldHelpers('accountType').setValue('PERSONAL');
                        }}
                        value="PERSONAL"
                      />
                      <label
                        className="m-0 font-size-base font-weight-bolder cursor-pointer"
                        style={{ color: '#4A5677', lineHeight: '17px' }}
                        htmlFor="PERSONAL"
                      >
                        Cá nhân
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className="bg-light p-5">
                  <div>
                    <BaseTextField
                      label={
                        formik.getFieldProps('accountType').value === 'ENTERPRISE'
                          ? 'Tên doanh nghiệp'
                          : 'Họ tên'
                      }
                      require={true}
                      name="fullname"
                      type="text"
                      placeholder={
                        formik.getFieldProps('accountType').value === 'ENTERPRISE'
                          ? 'Nhập tên doanh nghiệp'
                          : 'Nhập họ tên'
                      }
                      fieldHelper={formik.getFieldHelpers('fullname')}
                      fieldProps={formik.getFieldProps('fullname')}
                      fieldMeta={formik.getFieldMeta('fullname')}
                    />
                  </div>
                  {formik.values.accountType === 'ENTERPRISE' && (
                    <div>
                      <BaseTextField
                        label="Mã số thuế"
                        require={true}
                        name="taxCode"
                        type="text"
                        placeholder="Nhập mã số thuế"
                        fieldHelper={formik.getFieldHelpers('taxCode')}
                        fieldProps={formik.getFieldProps('taxCode')}
                        fieldMeta={formik.getFieldMeta('taxCode')}
                      />
                    </div>
                  )}
                  {formik.getFieldProps('accountType').value === 'ENTERPRISE' ? (
                    <div>
                      <BaseTextField
                        label="Mật khẩu"
                        require={true}
                        name="password"
                        type="text"
                        placeholder="Nhập mật khẩu"
                        fieldHelper={formik.getFieldHelpers('password')}
                        fieldProps={formik.getFieldProps('password')}
                        fieldMeta={formik.getFieldMeta('password')}
                      />
                    </div>
                  ) : null}
                  <div className="row">
                    <div
                      className={`${
                        formik.getFieldProps('accountType').value === 'ENTERPRISE'
                          ? 'col-lg-6 col-md-12'
                          : 'col-12'
                      }`}
                    >
                      <BaseTextField
                        label="Email"
                        require={true}
                        name="email"
                        type="text"
                        placeholder="Nhập email"
                        fieldHelper={formik.getFieldHelpers('email')}
                        fieldProps={formik.getFieldProps('email')}
                        fieldMeta={formik.getFieldMeta('email')}
                      />
                    </div>
                    {formik.getFieldProps('accountType').value !== 'ENTERPRISE' ? (
                      <div className="col-12">
                        <BaseTextField
                          label="Mật khẩu"
                          require={true}
                          name="password"
                          type="text"
                          placeholder="Nhập mật khẩu"
                          fieldHelper={formik.getFieldHelpers('password')}
                          fieldProps={formik.getFieldProps('password')}
                          fieldMeta={formik.getFieldMeta('password')}
                        />
                      </div>
                    ) : null}
                    <div
                      className={`${
                        formik.getFieldProps('accountType').value === 'ENTERPRISE'
                          ? 'col-lg-6 col-md-12'
                          : 'col-12'
                      }`}
                    >
                      <BaseTextField
                        label="Số điện thoại"
                        name="phone"
                        type="text"
                        placeholder="Nhập số điện thoại"
                        fieldHelper={formik.getFieldHelpers('phone')}
                        fieldProps={formik.getFieldProps('phone')}
                        fieldMeta={formik.getFieldMeta('phone')}
                      />
                    </div>
                  </div>
                  {/* google captcha */}
                  <div>
                    <CaptchaInput
                      name="captcha"
                      onChange={(value) => formik.getFieldHelpers('captcha').setValue(value)}
                      fieldMeta={formik.getFieldMeta('captcha')}
                    />
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="p-0 d-flex flex-column">
                {/* <div className="d-flex flex-row align-items-center p-5">
                    <BaseCheckBox
                      name="checkboxConfirm"
                      additionClassName="m-0"
                      additionLabelStyle={{ color: '#4A5677', lineHeight: '17px', fontWeight: '500' }}
                      fieldHelper={formik.getFieldHelpers('confirm')}
                      fieldProps={formik.getFieldProps('confirm')}
                      fieldMeta={formik.getFieldMeta('confirm')}
                      labelElement={
                        <span>
                          <span
                            className="font-size-base font-weight-bolder"
                            style={{ color: '#313C59' }}
                          >
                            Tôi đã hiểu và đồng ý với
                          </span>
                          <a
                            target="_blank"
                            href={AppConfigs.termsUrl}
                            className="mx-1 font-size-base font-weight-bolder cursor-pointer"
                            style={{ color: '#2E62E9' }}
                          >
                            Điều khoản dịch vụ
                          </a>
                          <span
                            className="font-size-base font-weight-bolder"
                            style={{ color: '#313C59' }}
                          >
                            do ICORP eContract cung cấp
                          </span>
                        </span>
                      }
                    />
                  </div> */}
                <div className="p-5">
                  {/* <AppButton
                      className={`btn-green${
                        formik.getFieldProps('confirm').value && formik.getFieldProps('captcha').value
                          ? ''
                          : '-disabled'
                      } w-100`}
                      text="Đăng Ký"
                      disabled={
                        !formik.getFieldProps('confirm').value ||
                        !formik.getFieldProps('captcha').value
                      }
                    /> */}
                  <Button
                    className="font-weight-bold flex-grow-1 col"
                    variant="primary"
                    disabled={
                      // !formik.getFieldProps('confirm').value ||
                      !formik.getFieldProps('captcha').value
                    }
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    Đăng ký
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
      {/* <ModalForgotPassword
        show={showModalForgotPassword}
        onClose={() => setShowModalForgotPassword(false)}
      /> */}
      <Modal
        show={showNotiModal}
        centered
        onHide={() => {
          setShowNotiModal(false);
          setSavedEmail('');
          history.push('/dang-nhap');
        }}
      >
        <Modal.Header className="d-flex align-items-center justify-content-center">
          <Modal.Title>Đăng Ký Thành Công</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center bg-light">
          <img src={AppResource.icons.icActiveAccount} alt="active account" />
          <p className="font-weight-boldest font-size-h6" style={{ color: '#00BA1F' }}>
            Đăng ký tài khoản thành công
          </p>
          <span className="text-remaining text-center font-weight-bolder">
            Vui lòng kiểm tra hòm thư{' '}
            <a
              href={`mailto:${savedEmail}`}
              className="text-primary font-weight-bolder cursor-pointer"
            >
              {savedEmail}
            </a>{' '}
            (bao gồm cả thư mục spam) để kích hoạt tài khoản.
          </span>
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center py-2">
          <Button
            className="font-weight-bolder"
            variant="secondary"
            onClick={() => {
              setShowNotiModal(false);
              setSavedEmail('');
              history.push('/dang-nhap');
            }}
          >
            Đóng lại
          </Button>
        </Modal.Footer>
      </Modal>
    </GuestBaseLayout>
  );
}

export default SignUpScreen;
