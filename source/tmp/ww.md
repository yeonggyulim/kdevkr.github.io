아라한사님의 스프링 시큐리티 따라하기를 참고하였습니다.

<https://www.youtube.com/watch?v=C0BQplG7Epo>

<http://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html>

스프링 시큐리티를 적용하지 않아도 HTTP 세션을 이용하여 사용자에 대한 검증을 할 수 있습니다만, 아이디와 비밀번호를 기준으로 어떠한 리소스에 대한 접근 경로에 대한 권한을 부여하고 싶을 때, 스프링 시큐리티의 간단한 설정만으로도 효율적으로 보안을 적용할 수 있다는 장점이 있습니다.

DelegatingFilterProxy

DelegatingFilterProxy는 스프링 프레임워크에서 제공하는 애플리케이션으로의 모든 요청을 확인하여 보안을 적용하는 서블릿 필터입니다. 따라서, 스프링 시큐리티를 사용하기 위해서는 org.spring.framework.web.filter.DelegatingFilterProxy를 반드시 활성화 시켜야 합니다. 많은 스프링 시큐리티에 대한 XML 설정에서 볼 수 있는 springSecurityFilterChain이라는 이름을 가진 필터이며, 자바 클래스로 단순히, AbstractSecurityWebApplicationInitializer를 상속받은 클래스를 구현하면 자동적으로 생성되어집니다.

public class WebSecurityApplicationInitializer extends AbstractSecurityWebApplicationInitializer {
}

Colored by Color Scripter
cs

@EnableWebSecurity 어노테이션을 적용한 AppSecurityConfig 클래스를 생성하도록 하겠습니다. 이 클래스는 WebSecurityConfigurerAdapter를 상속받아 구현하면 됩니다. 이제 configure(HttpSecurity http) 함수를 오버라이딩함으로써 저희가 원하는 형태로 접근권한을 설정할 수 있습니다. 저는 /admin/**에 대한 모든 경로에 대한 권한을 .hasRole("ADMIN")으로 설정하고 나머지(/**) 경로에 대해서는 permitAll()을 통해서 누구든지 접근할 수 있도록 설정하겠습니다. 또한, 스프링 시큐리티가 기본적으로 제공하고 있는 로그인 페이지를 커스터마이징하여 우리가 원하는 페이지에서 로그인 할수 있도록 formlogin을 통해 설정할 수 있습니다. 마지막으로 로그아웃 할 경우에 기본적으로 쿠키와 세션을 지우도록 되어있으나, 로그아웃 시 리다이렉트되어야하는 URL과 함께 명시하도록 하겠습니다.

@Configuration
@EnableWebSecurity
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@ComponentScan(basePackages = { "com.kdev.app" })
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired UserDetailsService userDetailsService;

    @Autowired
      public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
      }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // TODO Auto-generated method stub

        http.authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/**").permitAll();

        http.formLogin().loginPage("/login").defaultSuccessUrl("/information").successHandler(successHandler())
            .permitAll();

        http
        .logout()
            .logoutSuccessUrl("/")
            .deleteCookies("JSESSIONID")
            .invalidateHttpSession(true);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        // TODO Auto-generated method stub
        web.ignoring().antMatchers("/resources/**");
    }

    @Bean
    public AuthenticationSuccessHandler successHandler(){
        return new LoginAuthenticationSuccessHandler("/information");
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
Colored by Color Scripter
cs

추가적으로 configure(WebSecurity web)을 오버라이딩하여 JS, CSS와 같은 리소스들에 대해서는 확인하지 않도록 설정할 수 있습니다.

@EnableGlobalMethodSecurity 어노테이션은 컨트롤러 단에서 개별적으로 @Secured 어노테이션을 통해 권한별 접근을 허용할 수 있게 해주도록 하는 설정입니다.

이제 우리가 핵심적으로 살펴보아야할 부분은 @Autowird 어노테이션을 통해 바인딩 된 함수에 존재하는 AuthenticationManagerBuilder을 통해 커스터마이징 된 UserDetailsService를 설정하는 부분입니다.

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = Logger.getLogger(UserDetailsServiceImpl.class);
    @Autowired UserRepositoryService userRepositoryService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        UserVO userVO = userRepositoryService.findByEmail(email);
        if(userVO.equals(null))
            throw new UsernameNotFoundException(email);
        List<GrantedAuthority> ga = new ArrayList<GrantedAuthority>();
        ga.add(new SimpleGrantedAuthority(userVO.getRole()));

        return new UserDetailsImpl(userVO);
    }

}
Colored by Color Scripter
cs

UserDetailsServiceImpl은 앞서 등록되는 UserDetailsService 인터페이스에 대한 구현체 클래스이며 데이터베이스에서 사용자정보를 이메일로 비교하여 권한을 부여하는 역할 수행하도록 되어있습니다. 최종적으로 권한이 부여된 UserDetailsImpl 클래스를 생성하여 반환하는 것을 볼 수 있습니다. 그럼 이제 UserDetailsImpl 클래스가 어떻게 구현되는지를 살펴보겠습니다.

public class UserDetailsImpl extends User {
    private static final Logger logger = Logger.getLogger(UserDetailsImpl.class);
    private String email;
    private String userid;
    private String imageurl;
    private String socialtype;

    public UserDetailsImpl(UserVO userVO) {
        super(userVO.getUsername(), userVO.getPassword(), authorities(userVO));
        logger.info(userVO.toString());
        this.userid = userVO.getUserid();
        this.email = userVO.getEmail();
        this.imageurl = userVO.getImageurl();
        this.setSocialtype(userVO.getSocialtype());
        // TODO Auto-generated constructor stub
    }

    private static Collection<? extends GrantedAuthority> authorities(UserVO userVO) {
        // TODO Auto-generated method stub
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(userVO.getRole()));
        return authorities;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getImageurl() {
        return imageurl;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }

    public String getSocialtype() {
        return socialtype;
    }

    public void setSocialtype(String socialtype) {
        this.socialtype = socialtype;
    }

}
Colored by Color Scripter
cs

org.springframework.security.core.userdetails.User 클래스를 상속하여 구현되어짐을 확인할 수 있습니다. User클래스는 스프링 시큐리티에서 기본적으로 유저정보를 가지고 있는 UserDetails 인터페이스의 구현체입니다. 인터페이스를 직접적으로 구현할 수도 있으나 User를 상속받음으로써 스프링 시큐리티에서 제공하는 기본적인 기능을 활용할 수 있습니다. 또한, 이렇게 구현하면서 UserDetailsImpl의 필드를 이용하여 추가적인 사용자 정보를 주입시킬 수 있습니다.

그리고 또 한가지, 로그인 폼을 이용하지 않아도 다음과 같이 로그인을 인증할 수 있습니다.

@RequestMapping(value = "/social/signin", method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity&lt;Map&lt;String,Object>> SignInLogin(@ModelAttribute("UserVO") UserVO authObject) {
        ResponseEntity&lt;Map&lt;String,Object>> response = null;
        Map&lt;String, Object> object = new HashMap&lt;String, Object>();
        UserVO userObject = userRepositoryService.findByEmail(authObject.getEmail());

        if(userObject == null){

            authObject.setPassword(passwordEncoder.encode(authObject.getPassword()));
            authObject.setEnabled(true);
            authObject.setRole("ROLE_USER");

            userRepositoryService.signIn(authObject);

            UserDetailsImpl userDetails = new UserDetailsImpl(authObject);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            object.put("responseText", "Signin OK");
            response = new ResponseEntity<Map<String,Object>>(object,HttpStatus.OK);
        }else{
            object.put("responseText", "Signin Fail");
            response = new ResponseEntity<Map<String,Object>>(object,HttpStatus.BAD_REQUEST);

        }
        return response;
    }

Colored by Color Scripter
cs

회원가입 하려는 유저에 대한 정보를 받아온 뒤 서버 데이터베이스에서 존재하는 지를 파악한 후 유저정보를 데이터베이스에 저장한 뒤, 유저정보를 활용하여 UsernamePasswordAuthenticationToken을 통해 주입된 Authentication을 SecurityContextHolder의 컨텍스트에 설정하는 것으로 로그인 인증과 권한을 부여할 수 있습니다.

이로써, 스프링 시큐리티를 자바로 설정하는 것을 확인하였으며, 추가적인 확장을 통해 다양한 인증과 권한을 적용할 수 있음을 보았습니다. 패스워드 암호화 및 복호화에 대한 부분은 아라한사님의 스프링 시큐리티 따라하기 동영상을 참고하시면 좋을 듯 합니다.

2.  스프링 시큐리티가 제공하는 CSRF 정책에 대하여 알아보겠습니다.

<http://docs.spring.io/spring-security/site/docs/current/reference/html/csrf.html>

일반적으로 공격자가 세션을 위조하여 사용자가 의도하지 않은 요청을 하는 것을 막기 위해 CSRF 정책을 제공한다고 하니다. 다음은 CSRF에 대한 다양한 설정방법을 확인할 수 있습니다.

1) CSRF 정책을 사용하지 않고 싶다면 http.csrf().disable()를 설정하시기 바랍니다.

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

@Override
protected void configure(HttpSecurity http) throws Exception {
	http
	.csrf().disable();
}
}

2) 일반적인 폼에서 CSRF 토큰을 설정하고 싶다면

<input type="hidden"
	name="${_csrf.parameterName}"
	value="${_csrf.token}"/>

3) XHR, AJAX에서 CSRF 토큰을 설정하고 싶다면

<html>
<head>
	<meta name="_csrf" content="${_csrf.token}"/>
	<!-- default header name is X-CSRF-TOKEN -->
	<meta name="_csrf_header" content="${_csrf.headerName}"/>
	<!-- ... -->
</head>
<!-- ... -->
$(function () {
var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function(e, xhr, options) {
	xhr.setRequestHeader(header, token);
});
});

출처: <https://kdevkr.tistory.com/595> [잠만보의 개발 블로그]
