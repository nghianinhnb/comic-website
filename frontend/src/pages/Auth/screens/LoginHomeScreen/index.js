import { FastField, Formik, useFormik } from 'formik';
import KTFormGroup from 'general/components/Forms/KTFormGroup';
import KTFormInput, { KTFormInputType } from 'general/components/Forms/KTFormInput';
import GuestBaseLayout from 'general/components/eInvoiceComponents/BaseLayout/GuestBaseLayout';
import AppResource from 'general/constants/AppResource';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import './style.scss';
import ModalForgotPassword from 'features/Auth/components/ModalForgotPassword';
import { useDispatch } from 'react-redux';
import { thunkSignIn } from 'app/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Utils from 'general/utils/Utils';
import ToastHelper from 'general/helpers/ToastHelper';
import { useHistory } from 'react-router-dom';
import UserHelper from 'general/helpers/UserHelper';
import PreferenceKeys from 'general/constants/PreferenceKeys';

LoginHomeScreen.propTypes = {};

const sTag = '[LoginHomeScreen]';

function LoginHomeScreen(props) {
  // MARK --- Params: ---
  const [isPersonalAccount, setIsPersonalAccount] = useState(false);
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: localStorage.getItem(PreferenceKeys.savedLoginEmail) ?? '',
      password: localStorage.getItem(PreferenceKeys.savedLoginPassword) ?? '',
      taxCode: '',
    },
    validationSchema: Yup.object({
      username: isPersonalAccount
        ? Yup.string().nullable()
        : Yup.string().trim().required(t('Required')),
      password: Yup.string().trim().required(t('Required')),
      taxCode: isPersonalAccount
        ? Yup.string().trim().required(t('Required'))
        : Yup.string().nullable(),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const params = { ...values };
      let inputPassword = params.password;
      params.password = Utils.sha256(inputPassword);
      if (!isPersonalAccount) {
        params.taxCode = params.username;
      }
      console.log(`${sTag} on submit: ${JSON.stringify(params)}`);
      try {
        const res = unwrapResult(await dispatch(thunkSignIn(params)));
        if (res) {
          const displayName = UserHelper.getDisplayName(res.account);
          localStorage.setItem(PreferenceKeys.savedLoginEmail, params.username);
          localStorage.setItem(PreferenceKeys.savedLoginPassword, values.password);
          ToastHelper.showSuccess(`Xin chào, ${displayName}`);
          history.push('/ban-lam-viec');
        }
      } catch (error) {
        console.log(`${sTag} loggin error: ${error.message}`);
      }
    },
  });

  //MARK --- Hooks: ---
  useEffect(() => {
    const usernameValue = formik.getFieldProps('username').value;
    const numberRegtype = new RegExp(/^[0-9]{10}-[0-9]{3}|[0-9]{10}$/);
    const numberReg = new RegExp(/^\d{10}(-\d{3})?$/);
    const validateEmail = (email) => {
      return email.includes('@');
    };
    const validateEmpty = (username) => {
      return String(username)
        .toLowerCase()
        .match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm);
    };

    if (!validateEmpty(usernameValue)) {
      if (numberReg.test(usernameValue) || validateEmail(usernameValue)) {
        setIsPersonalAccount(false);
      } else {
        setIsPersonalAccount(true);
      }
    }
  }, [formik.getFieldProps('username').value]);

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
          <div className="col-11 py-10 py-lg-0 col-sm-8 col-lg-5 col-xxl-5 col-md-6">
            <Card>
              <Card.Header className="text-center d-flex flex-column  align-items-center">
                {/* <div
                  className="border bg-white rounded mb-6 py-2 px-12"
                  style={{ marginTop: '-4rem', width: 'fit-content' }}
                >
                  <img src={AppResource.images.img_viet_invoice_logo} alt="logo" />
                </div> */}
                <p
                  className="font-weight-bolder text-center m-0"
                  style={{ fontSize: '2.31rem', lineHeight: '32px', color: '#18214D' }}
                >
                  {t('Sign in')}
                </p>
                <span style={{ fontSize: '1.15rem', color: '#18214D' }}>
                  {t('Electronic invoice solution VIET INVOICE')}
                </span>
              </Card.Header>
              <Card.Body className="bg-light">
                <div>
                  {/* username */}
                  <KTFormGroup
                    label={
                      <>
                        {t('MST/Email/Tên đăng nhập')} <span className="text-danger">(*)</span>
                      </>
                    }
                    inputName="username"
                    inputElement={
                      <KTFormInput
                        name="username"
                        value={formik.getFieldProps('username').value}
                        onChange={(value) => {
                          formik.getFieldHelpers('username').setValue(value);
                        }}
                        onFocus={() => {
                          formik.getFieldHelpers('username').setTouched(true);
                        }}
                        enableCheckValid
                        isValid={_.isEmpty(formik.getFieldMeta('username').error)}
                        isTouched={formik.getFieldMeta('username').touched}
                        feedbackText={formik.getFieldMeta('username').error}
                        type={KTFormInputType.text}
                        placeholder={`${_.capitalize(t('MST/Email/Tên đăng nhập'))}...`}
                        // disabled={!canEdit}
                      />
                    }
                  />

                  {/* password */}
                  <KTFormGroup
                    label={
                      <>
                        {t('Password')} <span className="text-danger">(*)</span>
                      </>
                    }
                    additionalClassName={`${isPersonalAccount ? '' : 'm-0'}`}
                    inputName="password"
                    inputElement={
                      <KTFormInput
                        name="password"
                        value={formik.getFieldProps('password').value}
                        onChange={(value) => {
                          formik.getFieldHelpers('password').setValue(value);
                        }}
                        onFocus={() => {
                          formik.getFieldHelpers('password').setTouched(true);
                        }}
                        enableCheckValid
                        isValid={_.isEmpty(formik.getFieldMeta('password').error)}
                        isTouched={formik.getFieldMeta('password').touched}
                        feedbackText={formik.getFieldMeta('password').error}
                        type={KTFormInputType.password}
                        placeholder={`${_.capitalize(t('Password'))}...`}
                        // disabled={!canEdit}
                      />
                    }
                  />

                  {/* taxCode */}
                  {isPersonalAccount ? (
                    <KTFormGroup
                      label={
                        <>
                          {t('Tax code')} <span className="text-danger">(*)</span>
                        </>
                      }
                      additionalClassName="m-0"
                      inputName="taxCode"
                      inputElement={
                        <KTFormInput
                          name="taxCode"
                          value={formik.getFieldProps('taxCode').value}
                          onChange={(value) => {
                            formik.getFieldHelpers('taxCode').setValue(value);
                          }}
                          onFocus={() => {
                            formik.getFieldHelpers('taxCode').setTouched(true);
                          }}
                          enableCheckValid
                          isValid={_.isEmpty(formik.getFieldMeta('taxCode').error)}
                          isTouched={formik.getFieldMeta('taxCode').touched}
                          feedbackText={formik.getFieldMeta('taxCode').error}
                          type={KTFormInputType.text}
                          placeholder={`${_.capitalize(t('Tax code'))}...`}
                          // disabled={!canEdit}
                        />
                      }
                    />
                  ) : null}
                </div>
                <div className="mt-5 text-end">
                  <span
                    className="font-size-base font-weight-bolder cursor-pointer text-primary text-hover-muted"
                    // style={{ color: AppResource.colors.remainingColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModalForgotPassword(true);
                    }}
                  >
                    {t('Forgot password')} ?
                  </span>
                </div>
              </Card.Body>
              <Card.Footer className="px-0">
                <div className="px-9">
                  <Button
                    className="font-weight-bold flex-grow-1 col"
                    variant="primary"
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    {t('Sign in')}
                  </Button>
                </div>
                <div className="border-top mt-6 px-9 text-center">
                  <p className="font-weight-bolder mt-4">Bạn chưa có tài khoản VIET INVOICE ?</p>
                  <Button
                    className="font-weight-bold flex-grow-1 col btn-outline-primary"
                    variant=""
                    onClick={() => {
                      history.push('/dang-ky');
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
      <ModalForgotPassword
        show={showModalForgotPassword}
        onClose={() => setShowModalForgotPassword(false)}
      />
    </GuestBaseLayout>
  );
}

export default LoginHomeScreen;
