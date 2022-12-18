package einkaufslistenmanager.backend.v2.api.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

/**
 * Controller for handling requests related to {@link Benutzer} entities.
 */
@RestController
@RequestMapping("/api/benutzer")
@SecurityRequirement(name = "JSESSIONID")
public class BenutzerController {
	
	private static final Logger logger = LoggerFactory.getLogger(BenutzerController.class);

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
	 * Handles a GET request for retrieving a single {@link Benutzer} entity by its ID.
	 * 
	 * @param id ID of the requested {@link Benutzer} entity.
	 * @return a {@link ResponseEntity} with status OK and the requested {@link Benutzer} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the requested {@link Benutzer} entity was not found.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<Benutzer> getBenutzer(@PathVariable(value = "id") Integer id) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Benutzer> benutzer = benutzerRepository.findById(id);
		if (benutzer.isEmpty()) {
			logger.error("Benutzer with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok().body(benutzer.get());
	}

	/**
	 * Handles a GET request for retrieving all {@link Benutzer} entities.
	 * 
	 * @return a {@link ResponseEntity} with status OK and a list of all {@link Benutzer} entities in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@GetMapping("")
	public ResponseEntity<List<Benutzer>> getAllBenutzer() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		List<Benutzer> benutzer = benutzerRepository.findAll();
		return ResponseEntity.ok().body(benutzer);
	}


	/**
	 * Handles a POST request for creating a new {@link Benutzer} entity.
	 * 
	 * @param benutzer {@link Benutzer} entity to be created.
	 * @return a {@link ResponseEntity} with status OK and the created {@link Benutzer} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PostMapping("")
	public ResponseEntity<Benutzer> createBenutzer(@RequestBody Benutzer benutzer) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		benutzer.setAccessibleEinkaufslisten(new HashSet<>());
		benutzer.setEinkaufslisten(new ArrayList<>());
		
		Benutzer newUser = benutzerRepository.save(benutzer);
		logger.info("Benutzer {} with id {} CREATED",newUser.getUsername(),newUser.getId());
		return ResponseEntity.ok().body(newUser);
	}

	/**
	 * Handles a PUT request for updating an existing {@link Benutzer} entity.
	 * 
	 * @param id ID of the {@link Benutzer} entity to be updated.
	 * @param benutzer Updated {@link Benutzer} entity.
	 * @return a {@link ResponseEntity} with status OK and the updated {@link Benutzer} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Benutzer} entity with the specified ID was not found.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Benutzer> updateBenutzer(@PathVariable Integer id, @RequestBody Benutzer benutzer) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Benutzer> existingBenutzer = benutzerRepository.findById(id);
		if (existingBenutzer.isEmpty()) {
			logger.error("Benutzer with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}

		existingBenutzer.get().setUsername(benutzer.getUsername());
		existingBenutzer.get().setPassword(benutzer.getPassword());
		
		logger.info("Benutzer {} with id {} UPDATED",existingBenutzer.get().getUsername(),existingBenutzer.get().getId());

		return ResponseEntity.ok().body(benutzerRepository.save(existingBenutzer.get()));
	}

	/**
	 * Handles a DELETE request for deleting an existing {@link Benutzer} entity.
	 * 
	 * @param id ID of the {@link Benutzer} entity to be deleted.
	 * @return a {@link ResponseEntity} with status OK and no body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Benutzer} entity with the specified ID was not found.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBenutzer(@PathVariable Integer id) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!benutzerRepository.existsById(id)) {
			logger.error("Benutzer with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}

		logger.info("Benutzer with id {} DELETED",id);

		benutzerRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}