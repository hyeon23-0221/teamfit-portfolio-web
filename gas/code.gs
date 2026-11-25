/**
 * ==============================================================================
 * Google Apps Script (GAS) 서버 측 스크립트 - Code.gs
 * 프로젝트: 팀핏 & 스마트 포트폴리오 허브 (TeamFit & Smart Portfolio Hub)
 * ==============================================================================
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('TeamFit & Smart Portfolio Hub')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Cloud Run / 외부 백엔드 API 통신 프록시
 */
function callBackendApi(serverUrl, endpoint, payload) {
  if (!serverUrl || serverUrl.trim() === '') {
    return {
      success: false,
      error: '백엔드 서비스 URL이 지정되지 않았습니다.'
    };
  }

  var cleanUrl = serverUrl.trim().replace(/\/+$/, '') + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(cleanUrl, options);
    var code = response.getResponseCode();
    var text = response.getContentText();
    return {
      success: code >= 200 && code < 300,
      statusCode: code,
      data: JSON.parse(text)
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * 스크립트 속성(PropertiesService)에서 배포된 백엔드 URL 읽기
 */
function getBackendUrl() {
  return PropertiesService.getScriptProperties().getProperty('BACKEND_SERVICE_URL') || '';
}

/**
 * Cloud Run 배포 완료 후 백엔드 URL 동기화용 웹훅
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.serviceUrl) {
      PropertiesService.getScriptProperties().setProperty('BACKEND_SERVICE_URL', data.serviceUrl);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: '서비스 URL이 성공적으로 동기화되었습니다.',
        url: data.serviceUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'serviceUrl 필드가 누락되었습니다.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
