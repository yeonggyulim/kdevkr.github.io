---
title:      "Google OAuth 2.0"
subtitle:   "OAuth"
date:       2017-11-06 12:00:00
categories: [끄적끄적, Java]
banner:
 url: https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg
---

## Google Identity Platform  
본 글은 구글에서 제공하는 레퍼런스 문서를 토대로 작성하였습니다  
- [https://developers.google.com/identity/protocols/OAuth2](https://developers.google.com/identity/protocols/OAuth2)  
- [https://developers.google.com/identity/protocols/OAuth2WebServer](https://developers.google.com/identity/protocols/OAuth2WebServer)  


#### Create authorizaiton credentials  
Google API를 이용하기 위해서는 OAuth 2.0 방식으로 인증을 해야합니다. 이때 인증에 필요한 정보들을 설정해야하는데 [Credentials page](https://console.developers.google.com/apis/credentials)에서 사용자 인증 정보를 만들어야 합니다.

`사용자 인증 정보 만들기` - `OAuth 클라이언트 ID` - `웹 애플리케이션`을 만들도록 합시다  

만드는 과정에서 `승인된 자바스크립트 원본` 항목과 `승인된 리디렉션 URI` 항목이 있습니다 만약 서버사이드 기반의 웹 애플리케이션에서 요청한다면 리디렉션 URI에 여러분의 애플리케이션 주소를 적어주시면 됩니다.

```
# 승인된 리디렉션 URI
http://localhost:8080/oauth/google/callback
```


#### Identify access scopes  
스코프는 애플리케이션이 Google API를 이용할 수 있도록 허용하는 항목이라고 볼 수 있습니다. [OAuth 2.0 API Scopes](https://developers.google.com/identity/protocols/googlescopes)에서 여러분의 애플리케이션에서 사용해야하는 API 스코프를 확인하시기 바랍니다.  


#### Obtaining OAuth 2.0 access tokens  
애플리케이션에서 Google API를 이용할 수 있도록 액세스 토큰을 얻어야 합니다. 사용자의 인증 과정을 거쳐야 하기 때문에 인증 요청을 만들어야 합니다. 인증요청을 만들수 있는 HTTP/REST Enpoint는 `https:/accounts.google.com/o/oauth2/v2/auth` 입니다.  

아래는 인증 요청을 만든 예시입니다.
```bash
https://accounts.google.com/o/oauth2/v2/auth?
scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me&
access_type=offline&
include_granted_scopes=true& #리디렉션될 때 파라미터에 요청 스코프를 포함할지에 대한 여부
state=&
redirect_uri=http://localhost:8080/oauth/google/callback&
response_type=code&
client_id=491359105490-0rhr3rs7oj9ou1t0ln1i3k7m1ifc1r9s.apps.googleusercontent.com&
prompt=consent #사용자에게 권한 허용을 확인받을 지에 대한 설정
```

웹 브라우저에 해당 URL을 입력하게 되면 Google Authorization Server에서 인증 창을 제공해주고 사용자 인증 프로세스를 거쳐 우리의 애플리케이션 서버의 https://localhost:8080/oauth/google/callback으로 리디렉션 됩니다. 응답은 다음과 같습니다
```bash
# 사용자 인증 성공시(인증 요청 파라미터에 따라 부가 파라미터가 붙습니다)
http://localhost:8080/oauth/google/callback?code=4/8yzyuncSDHchngBbG7V-AVfngd7KTrEsRQJOAW6gz-c
# 사용자 인증 실패시(또는 취소 버튼을 눌렀을 때)
http://localhost:8080/oauth/google/callback?error=access_denied
```

에러 파라미터가 존재하면 서버 컨트롤러에서 특정 URL로 보내도록 처리하면 되겠네요
이제 응답받은 코드로 액세스 토큰을 요청해야합니다.  

HTTP/REST Endpoint이기 때문에 서버에서도 요청할 수 있습니다 저는 스프링의 RestTemplate를 이용해보도록 하겠습니다  

Token HTTP/REST Endpoint : `https://www.googleapis.com/oauth2/v4/token`

``` java
@GetMapping()
public ResponseEntity<Object> callback(HttpServletRequest request, HttpServletResponse response) throws RestClientException, URISyntaxException {
	RestTemplate restTemplate = new RestTemplate();

	Map<String, String[]> parameterMap = request.getParameterMap();

	Set<String> parameterKeys = parameterMap.keySet();
	Iterator<String> paramterKeysItr = parameterKeys.iterator();

	while(paramterKeysItr.hasNext()) {
		String key = paramterKeysItr.next();
		logger.info("parameterName : {}, parameterValue : {}", key, parameterMap.get(key));
	}

	String code = parameterMap.get("code") != null ? parameterMap.get("code")[0] : null;
	if(Optional.ofNullable(code).isPresent()) {
		MultiValueMap<String, Object> uriVariables = new LinkedMultiValueMap<String, Object>();
		HttpHeaders headers = new HttpHeaders();

		uriVariables.add("code", code);
		uriVariables.add("client_id", "491359105490-0rhr3rs7oj9ou1t0ln1i3k7m1ifc1r9s.apps.googleusercontent.com");
		uriVariables.add("client_secret", "[PROTECT]");
		uriVariables.add("redirect_uri", "http://localhost:8080/oauth/google/callback");
		uriVariables.add("grant_type", "authorization_code");

		HttpEntity<?> httpEntity = new HttpEntity<>(uriVariables, headers);

		ResponseEntity<Map> tokenResponse = restTemplate.exchange(new URI("https://www.googleapis.com/oauth2/v4/token"), HttpMethod.POST, httpEntity, Map.class);
		Map<String, String> tokenMap =  tokenResponse.getBody();
		return getProfile(tokenMap.get("token_type"), tokenMap.get("access_token"));
	}
	return new ResponseEntity<Object>(parameterMap, HttpStatus.BAD_REQUEST);
}

public ResponseEntity<Object> getProfile(String tokenType, String accessToken) throws RestClientException, URISyntaxException {
	RestTemplate restTemplate = new RestTemplate();
	MultiValueMap<String, Object> uriVariables = new LinkedMultiValueMap<String, Object>();
	HttpHeaders headers = new HttpHeaders();
	headers.add("Authorization", tokenType + " " + accessToken);

	HttpEntity<?> httpEntity = new HttpEntity<>(uriVariables, headers);

	ResponseEntity<Object> tokenResponse = restTemplate.exchange(new URI("https://www.googleapis.com/oauth2/v1/userinfo"), HttpMethod.GET, httpEntity, Object.class);
	return tokenResponse;
}
```

위 코드는 응답받은 code 파라미터 값을 이용해서 액세스 토큰을 발급받은 뒤 인증된 사용자의 프로필을 가져오는 샘플입니다. (코드가 이쁘지 않으니 감안해서 봐주세요)

현재 우리가 확인해야할 부분은 tokenMap에 어떠한 값들이 있는지 입니다.  

```json
{access_token=ya29.Glv6BB7bWE33oZ1fsOvpSDy3xXGGK7mE1pUf9r3Ua9mz1yuGJGAaV0_-Vq5oD_q_wd5PEk1y366OVjD3p74xkRVba6yzszFKwZXKVRElWEqE3Z6FS1MLxLDaiJZA, token_type=Bearer, expires_in=3600, refresh_token=[PROTECT], id_token=[PROTECT]}
```

토큰 유형은 Bearer이고 만료 시간은 1시간이네요

가져온 액세스 토큰으로 사용자 프로필을 가져오는 HTTP/REST Endpoint는 `https://www.googleapis.com/oauth2/v1/userinfo`입니다. (앞서 인증 요청을 만들때 지정했던 스코프에 따라서 응답받은 데이터가 다를 수 있습니다)

`Authorization` 헤더에 토큰정보를 담아 요청하면 Google API를 이용할 수 있게 되는 것입니다

최종적으로 코드상으로 볼때 사용자는 다음의 데이터를 화면에서 볼 수 있습니다
```json
{"id":"110622004928259057872","email":"kdevkr@gmail.com","verified_email":true,"name":"Dev K","given_name":"Dev","family_name":"K","link":"https://plus.google.com/110622004928259057872","picture":"https://lh5.googleusercontent.com/-v0KlnX-vawg/AAAAAAAAAAI/AAAAAAAAAEo/yDvHp0fPKxw/photo.jpg","gender":"male","locale":"ko"}
```

이제 프로필 정보를 통해 회원가입을 하거나 액세스 토큰 및 리프래시 토큰을 데이터베이스에 저장하여 사용자가 로그인하지 않아도 애플리케이션에서 Google API를 이용할 수 있게 됩니다  


#### Refreshing an access token (offline access)  
만약, 액세스 토큰이 만료되었다면 해당 토큰으로는 더이상 Google API를 이용할 수 없습니다 서버-사이드 애플리케이션은 액세스 토큰을 발급받을 수 있는 리프래시 토큰도 같이 받기 때문에 이를 활용하면 됩니다.  

앞서 토큰정보를 받아오는 HTTP/REST Enpoint는 `https://www.googleapis.com/oauth2/v4/token`라고 했습니다. `grant_type` 파라미터는 refresh_token, `refresh_token` 파라미터에는 발급받은 리프래시 토큰을 명시해주면 됩니다.  

```
{access_token=ya29.Glv6BENT6QYzLNF70d02477jHrP6flI7wsoXxVcT-OOw7ArkiASa0WJrTn170xeZtXtiS3rYi8YQ3SRMzsOPHdmZDT5XktGswE5oa4bMvJWWy-Ui8r6GvNWjqwla, token_type=Bearer, expires_in=3600, id_token=[PROTECT]}
```

`TIP`  
- 제가 알아본 바로는 구글에서 발급해주는 리프래시 토큰의 개수는 제한되어있으며, 신규 리프래시 토큰이 발급되면 가장 오래된 토큰은 만료됩니다.  
- 토큰을 만료시키고 싶다면 `Revoke HTTP/REST Endpoint`로 요청하면 됩니다 `https://accounts.google.com/o/oauth2/revoke?token={token}`  


## 마치며  
Google 뿐만 아니라 Facebook, Instagram, Twitter, Kakao 등도 OAuth 방식을 통해 인증하여 API를 이용할 수 있도록 레퍼런스 문서를 제공하고 있습니다.
