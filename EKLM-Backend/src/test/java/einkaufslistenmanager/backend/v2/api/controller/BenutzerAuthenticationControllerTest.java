package einkaufslistenmanager.backend.v2.api.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;

@ExtendWith(MockitoExtension.class)
public class BenutzerAuthenticationControllerTest {

	@Mock
	private BenutzerRepository benutzerRepository;

	@Mock
	private HttpSession session;

	@InjectMocks
	private BenutzerAuthenticationController controller;

	@Test
	public void testAuthenticateUser_whenUserLoggedIn_shouldReturnOk() {
		when(session.getAttribute("userId")).thenReturn(1);
		ResponseEntity<?> response = controller.authenticateUser();
		assertEquals(HttpStatus.OK, response.getStatusCode());
	}

	@Test
	public void testAuthenticateUser_whenUserNotLoggedIn_shouldReturnUnauthorized() {
		when(session.getAttribute("userId")).thenReturn(null);
		ResponseEntity<?> response = controller.authenticateUser();
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("PLEASE_LOGIN", response.getBody());
	}
	@Test
	public void testAuthenticateUser_whenUsernameAndPasswordAreInvalid_shouldReturnUnauthorized() {
		when(benutzerRepository.findByUsernameAndPassword("user", "password")).thenReturn(Optional.empty());
		ResponseEntity<?> response = controller.authenticateUser(new Benutzer("user", "password"));
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("LOGIN_FAILED", response.getBody());
	}

	@Test
	public void testUnAuthenticateUser_whenUserLoggedIn_shouldReturnOk() {
		when(session.getAttribute("userId")).thenReturn(1);
		ResponseEntity<?> response = controller.unAuthenticateUser();
		verify(session).invalidate();
		assertEquals(HttpStatus.OK, response.getStatusCode());
	}

	@Test
	public void testUnAuthenticateUser_whenUserNotLoggedIn_shouldReturnUnauthorized() {
		when(session.getAttribute("userId")).thenReturn(null);
		ResponseEntity<?> response = controller.unAuthenticateUser();
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("PLEASE_LOGIN", response.getBody());
	}

}