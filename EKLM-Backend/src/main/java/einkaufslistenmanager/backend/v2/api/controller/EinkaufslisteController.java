package einkaufslistenmanager.backend.v2.api.controller;

import java.util.ArrayList;
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
import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;
import einkaufslistenmanager.backend.v2.db.repository.EinkaufslisteRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/einkaufsliste")
@SecurityRequirement(name = "JSESSIONID")
public class EinkaufslisteController {

	private static final Logger logger = LoggerFactory.getLogger(EinkaufslisteController.class);
	
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
	 * Handles a GET request for retrieving all available {@link Einkaufsliste} entities.
	 * 
	 * @return a {@link ResponseEntity} with status OK and a list of {@link Einkaufsliste} entities as the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@GetMapping("")
	public ResponseEntity<List<Einkaufsliste>> getAllEinkaufsliste() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		List<Einkaufsliste> liste = einkaufslisteRepository.findAll();
		liste.forEach(l -> {
			if (l.getBesitzer() != null)
				l.setIsOwner(l.getBesitzer().getId() == currentUserId);
		});

		return ResponseEntity.ok().body(liste);
	}


	/**
	 * Handles a GET request for retrieving a specific {@link Einkaufsliste} entity by its ID.
	 * 
	 * @param id ID of the {@link Einkaufsliste} entity to be retrieved.
	 * @return a {@link ResponseEntity} with status OK and the requested {@link Einkaufsliste} entity as the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Einkaufsliste} entity with the specified ID was not found.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<Einkaufsliste> getEinkaufslisteById(@PathVariable(value = "id") Integer id) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Einkaufsliste> result = einkaufslisteRepository.findById(id);
		if (result.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}
		Einkaufsliste liste = result.get();
		if (liste.getBesitzer() != null)
			liste.setIsOwner(liste.getBesitzer().getId() == currentUserId);
		return ResponseEntity.ok().body(liste);
	}

	/**
	 * Handles a POST request for creating a new {@link Einkaufsliste} entity.
	 * 
	 * @param einkaufsliste {@link Einkaufsliste} entity to be created.
	 * @return a {@link ResponseEntity} with status OK and the newly created {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PostMapping("")
	public ResponseEntity<Einkaufsliste> createEinkaufsliste(@RequestBody Einkaufsliste einkaufsliste) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		einkaufsliste.setId(null);

		Benutzer benutzer = this.benutzerRepository.findById(currentUserId).get();
		einkaufsliste.setBesitzer(benutzer);
		einkaufsliste.setIsOwner(true);
		einkaufsliste.setInhalt(new ArrayList<>());
		
		Einkaufsliste newEKL = this.einkaufslisteRepository.save(einkaufsliste);
		logger.info("Einkaufsliste [{}] with id {} CREATED",einkaufsliste.getBezeichnung(),newEKL.getId());

		return ResponseEntity.ok().body(newEKL);
	}

	/**
	 * Handles a PUT request for updating an existing {@link Einkaufsliste} entity.
	 * 
	 * @param id ID of the {@link Einkaufsliste} entity to be updated.
	 * @param einkaufsliste Updated values for the {@link Einkaufsliste} entity.
	 * @return a {@link ResponseEntity} with status OK and the updated {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Einkaufsliste} entity with the specified ID was not found.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Einkaufsliste> updateEinkaufsliste(@PathVariable(value = "id") Integer id,
			@RequestBody Einkaufsliste einkaufsliste) {
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
		
		logger.info("Einkaufsliste {} [{}] UPDATED",
				ekl.getId(),
				ekl.getBezeichnung()
			);
		

		return ResponseEntity.ok(einkaufslisteRepository.save(ekl.update(einkaufsliste)));
	}

	/**
	 * Handles a DELETE request for deleting an existing {@link Einkaufsliste} entity.
	 * 
	 * @param id ID of the {@link Einkaufsliste} entity to be deleted.
	 * @return a {@link ResponseEntity} with status OK if the {@link Einkaufsliste} entity was successfully deleted,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Einkaufsliste} entity with the specified ID was not found.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteEinkaufsliste(@PathVariable(value = "id") Integer id) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Einkaufsliste> optEKL = einkaufslisteRepository.findById(id);
		if (optEKL.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",id);
			return ResponseEntity.badRequest().build();
		}
		einkaufslisteRepository.delete(optEKL.get());
		logger.info("Einkaufsliste {} [{}] DELETED",
				optEKL.get().getId(),
				optEKL.get().getBezeichnung()
			);
		return ResponseEntity.ok().build();
	}
}
