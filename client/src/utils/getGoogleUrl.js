function getGoogleOAuthURL() {
  const AUTHORIZE_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
  const GOOGLE_CLIENT_ID =
    '779018207520-qvftar8nin7c9bqo0q4ouk4mtj7gb6lc.apps.googleusercontent.com';
  const GOOGLE_OAUTH_REDIRECTION =
    'http://localhost:1337/api/sessions/oauth/google';
  const options = {
    redirect_uri: GOOGLE_OAUTH_REDIRECTION,
    client_id: GOOGLE_CLIENT_ID,
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    // token = implicit grant
    // code : a Basic authorization code flow, App이 엑세스 토큰을 얻는 방식
    response_type: 'code',
    // 권한 부여 서버가 사용자에게 재인증 및 동의를 요청하는지 여부를 지정하는 공백으로 구분된 문자열 값 목록
    // none : 인증 서버는 인증 또는 사용자 동의 화면을 표시하지 않음
    // consent :인증 서버는 클라이언트에 정보를 반환하기 전에 사용자에게 동의를 요청
    // select_account : 인증 서버는 사용자에게 사용자 계정을 선택하라는 메시지를 표시
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  console.log({ options });

  // URLSearchParams : URL 매개변수를 쉽게 가져옴
  // abc.com/ko/?page=1
  // 인스턴스 생성 : const params = new URLSearchParams(window.location.search);
  // const page = params.get('page'); // 1
  const qs = new URLSearchParams(options);
  console.log(qs.toString());

  // qs.toString : URL 을 문자열로 생성! (https://phiilu.com/?greeting=Hello+World)
  return `${AUTHORIZE_URI}?${qs.toString()}`;
}

export default getGoogleOAuthURL;
