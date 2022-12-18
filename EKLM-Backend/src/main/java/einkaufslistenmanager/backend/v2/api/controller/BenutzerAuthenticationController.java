package einkaufslistenmanager.backend.v2.api.controller;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;


/**
 * RestController class for handling HTTP requests related to user authentication.
 */
@RestController
@RequestMapping("/api/benutzer")
public class BenutzerAuthenticationController {

	private static final Logger logger = LoggerFactory.getLogger(BenutzerAuthenticationController.class);

	/**
	 * Repository for accessing {@link Benutzer} entities.
	 */
	@Autowired
	private BenutzerRepository benutzerRepository;

	/**
	 * HttpSession object for storing session-specific data.
	 */
	@Autowired
	private HttpSession session;

	/**
	 * Handles HTTP GET requests to check whether the current session has a user logged in.
	 * 
	 * @return a ResponseEntity object with an HTTP status of OK if the current session has a
	 *      user logged in, or an HTTP status of UNAUTHORIZED if the current session does not
	 *      have a user logged in.
	 */
	@GetMapping("/authentication")
	public ResponseEntity<?> authenticateUser() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("PLEASE_LOGIN");
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * Handles HTTP POST requests to log in a user with the specified username and password.
	 * 
	 * @param benutzer a Benutzer object containing the username and password to log in with.
	 * @return a ResponseEntity object with an HTTP status of OK if the login was successful, or
	 *      an HTTP status of UNAUTHORIZED if the login was unsuccessful.
	 */
	@PostMapping("/authentication")
	public ResponseEntity<?> authenticateUser(@RequestBody Benutzer benutzer) {
		Optional<Benutzer> optBenu = benutzerRepository.findByUsernameAndPassword(
				benutzer.getUsername(),
				benutzer.getPassword());
		if (optBenu.isEmpty()) {
			logger.error("Login of User {} failed!", benutzer.getUsername());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("LOGIN_FAILED");
		}
		logger.info("User {} successfully logged in!", benutzer.getUsername());
		// session.setMaxInactiveInterval( 30 * 60 );//-> 30 Minuten
		session.setAttribute("userId", optBenu.get().getId());
		return ResponseEntity.ok().build();
	}

	/**
	 * Handles HTTP DELETE requests to log out the current user.
	 * 
	 * @return a ResponseEntity object with an HTTP status of OK if the logout was successful, or
	 *      an HTTP status of UNAUTHORIZED if the logout was unsuccessful.
	 */
	@DeleteMapping("/authentication")
	public ResponseEntity<?> unAuthenticateUser() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("PLEASE_LOGIN");
		}
		session.invalidate();
		return ResponseEntity.ok().build();
	}

}
