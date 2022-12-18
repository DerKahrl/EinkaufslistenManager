package einkaufslistenmanager.backend.v2.api.controller;

import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;
import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;
import einkaufslistenmanager.backend.v2.db.repository.EinkaufslisteRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


@RestController
@RequestMapping("/api/einkaufsliste/{id}/user")
@SecurityRequirement(name = "JSESSIONID")
public class EinkaufslisteUserController {

	private static final Logger logger = LoggerFactory.getLogger(EinkaufslisteUserController.class);
	
	/**
	 * Repository for accessing {@link Einkaufsliste} entities.
	 */
	@Autowired
	private EinkaufslisteRepository einkaufslisteRepository;

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
	 * Handles a GET request for retrieving all  {@link Benutzer} who the {@link Einkaufsliste} is shared with.
	 * 
	 * @param id ID of the {@link Einkaufsliste}.
	 * @return a {@link ResponseEntity} with status OK and a list of {@link Benutzer} entities in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@GetMapping("")
	public ResponseEntity<Set<Benutzer>> getSharedWithUsers(@PathVariable(value = "id") Integer id) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Einkaufsliste> optEKL = einkaufslisteRepository.findById(id);
		if (optEKL.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}

		Einkaufsliste ekl = optEKL.get();

		return ResponseEntity.ok(ekl.getAccessibleEinkaufslisten());
	}

	/**
	 * Handles a POST request for adding a {@link Benutzer} to the {@link Einkaufsliste} .
	 * 
	 * @param eklId ID of the {@link Einkaufsliste}.
	 * @param benutzer entitiy of the {@link Benutzer} to be added.
	 * @return a {@link ResponseEntity} with status OK and a the updated {@link Benutzer} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PostMapping("")
	public ResponseEntity<Benutzer> shareWithUser(
			@PathVariable(value = "id") Integer eklId,
			@RequestBody Benutzer benutzer) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Einkaufsliste> optEKL = einkaufslisteRepository.findById(eklId);
		if (optEKL.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",eklId);
			return ResponseEntity.badRequest().build();
		}
		
		Optional<Benutzer> optUser = benutzerRepository.findById(benutzer.getId());
		if (optUser.isEmpty()) {
			logger.error("Benutzer with id {} not found!",benutzer.getId());
			return ResponseEntity.badRequest().build();
		}

		optUser.get().getAccessibleEinkaufslisten().add(optEKL.get());

		logger.info("Einkaufsliste {} [{}] shared with {}",
				optEKL.get().getId(),
				optEKL.get().getBezeichnung(),
				optUser.get().getUsername()
			);
		
		return ResponseEntity.ok(benutzerRepository.save(optUser.get()));
	}

	/**
	 * Handles a DELETE request for removing a {@link Benutzer} from the {@link Einkaufsliste} .
	 * 
	 * @param eklId ID of the {@link Einkaufsliste}.
	 * @param userid ID of the {@link Benutzer} to remove.
	 * @return a {@link ResponseEntity} with status OK and a the updated {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@DeleteMapping("/{userid}")
	public ResponseEntity<Einkaufsliste> unShareWithUser(
			@PathVariable(value = "id") Integer eklId,
			@PathVariable(value = "userid") Integer userid) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Einkaufsliste> optEKL = einkaufslisteRepository.findById(eklId);
		if (optEKL.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",eklId);
			return ResponseEntity.badRequest().build();
		}
		Optional<Benutzer> optBenu = this.benutzerRepository.findById(userid);
		if (optBenu.isEmpty()) {
			logger.error("Benutzer with id {} not found!",userid);
			return ResponseEntity.badRequest().build();
		}

		optBenu.get().getAccessibleEinkaufslisten().remove(optEKL.get());
		benutzerRepository.save(optBenu.get());

		optEKL.get().getAccessibleEinkaufslisten().remove(optBenu.get());
		
		logger.info("Einkaufsliste {} [{}] unshared with {}",
				optEKL.get().getId(),
				optEKL.get().getBezeichnung(),
				optBenu.get().getUsername()
			);
		
		return ResponseEntity.ok(optEKL.get());
	}
}