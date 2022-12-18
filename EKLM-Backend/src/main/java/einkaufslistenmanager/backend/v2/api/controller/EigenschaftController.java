package einkaufslistenmanager.backend.v2.api.controller;

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

import einkaufslistenmanager.backend.v2.db.entity.Eigenschaft;
import einkaufslistenmanager.backend.v2.db.repository.EigenschaftRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

/**
 * Controller for handling requests related to {@link Eigenschaft} entities.
 */
@RestController
@RequestMapping("/api/eigenschaft")
@SecurityRequirement(name = "JSESSIONID")
public class EigenschaftController {

	private static final Logger logger = LoggerFactory.getLogger(EigenschaftController.class);

	/**
	 * Repository for accessing {@link Eigenschaft} entities.
	 */
	@Autowired
	private EigenschaftRepository eigenschaftRepository;

	/**
	 * HttpSession object for storing session-specific data.
	 */
	@Autowired
	private HttpSession session;

	/**
	 * Handles a GET request for retrieving all {@link Eigenschaft} entities.
	 * 
	 * @return a {@link ResponseEntity} with status OK and a list of all {@link Eigenschaft} entities in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@GetMapping("")
	public ResponseEntity<List<Eigenschaft>> getAllEigenschaft() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok().body(eigenschaftRepository.findAll());
	}

	/**
	 * Handles a GET request for retrieving a specific {@link Eigenschaft} entity by ID.
	 * 
	 * @param eigenschaftId ID of the {@link Eigenschaft} entity to be retrieved.
	 * @return a {@link ResponseEntity} with status OK and the {@link Eigenschaft} entity with the specified ID in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Eigenschaft} entity with the specified ID was not found.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<Eigenschaft> getEigenschaftById(@PathVariable(value = "id") Integer eigenschaftId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Eigenschaft> eigenschaft = eigenschaftRepository.findById(eigenschaftId);
		if (eigenschaft.isEmpty()) {
			logger.error("Eigenschaft with id {} not found!",eigenschaftId);
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok().body(eigenschaft.get());
	}

	/**
	 * Handles a POST request for creating a new {@link Eigenschaft} entity.
	 * 
	 * @param eigenschaft {@link Eigenschaft} entity to be created.
	 * @return a {@link ResponseEntity} with status OK and the newly created {@link Eigenschaft} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PostMapping("")
	public ResponseEntity<Eigenschaft> createEigenschaft(@RequestBody Eigenschaft eigenschaft) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		final Eigenschaft eig = eigenschaftRepository.save(eigenschaft);
		final Integer eigenschaftId = eig.getEigsId();
		logger.info("Eigenschaft with id {} CREATED",eigenschaftId);

		return ResponseEntity.ok().body(eig);
	}


	/**
	 * Handles a PUT request for updating an existing {@link Eigenschaft} entity.
	 * 
	 * @param eigenschaftId ID of the {@link Eigenschaft} entity to be updated.
	 * @param eigenschaftDetails Updated values for the {@link Eigenschaft} entity.
	 * @return a {@link ResponseEntity} with status OK and the updated {@link Eigenschaft} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Eigenschaft} entity with the specified ID was not found.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Eigenschaft> updateEigenschaft(
			@PathVariable(value = "id") Integer eigenschaftId,
			@RequestBody Eigenschaft eigenschaftDetails) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Eigenschaft> eigenschaft = eigenschaftRepository.findById(eigenschaftId);
		if (eigenschaft.isEmpty()) {
			logger.error("Eigenschaft with id {} not found!",eigenschaftId);
			return ResponseEntity.badRequest().build();
		}
		eigenschaft.get().setBezeichnung		(eigenschaftDetails.getBezeichnung()		);
		eigenschaft.get().setVergleichsGruppe	(eigenschaftDetails.getVergleichsGruppe()	);
		eigenschaft.get().setPrio				(eigenschaftDetails.getPrio()				);
		eigenschaft.get().setAnzeigen			(eigenschaftDetails.getAnzeigen()			);

		Eigenschaft updatedEigenschaft = eigenschaftRepository.save(eigenschaft.get());
		
		logger.info("Eigenschaft with id {} UPDATED",eigenschaftId);
		
		return ResponseEntity.ok(updatedEigenschaft);
	}

	/**
	 * Handles a DELETE request for deleting an existing {@link Eigenschaft} entity.
	 * 
	 * @param eigenschaftId ID of the {@link Eigenschaft} entity to be deleted.
	 * @return a {@link ResponseEntity} with status OK if the {@link Eigenschaft} entity was successfully deleted,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated,
	 * or a {@link ResponseEntity} with status BAD_REQUEST if the {@link Eigenschaft} entity with the specified ID was not found.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Eigenschaft> deleteEigenschaft(@PathVariable(value = "id") Integer eigenschaftId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Eigenschaft> eigenschaft = eigenschaftRepository.findById(eigenschaftId);
		if (eigenschaft.isEmpty()) {
			logger.error("Eigenschaft with id {} not found!",eigenschaftId);
			return ResponseEntity.badRequest().build();
		}
		
		// Eigenschaft entfernen wenn diese in benutzung ist:
		eigenschaft.get().getProdukteMitEigenschaft().forEach( p -> p.getEigenschaften().remove(eigenschaft.get()));
		
		eigenschaftRepository.delete(eigenschaft.get());
		
		logger.info("Eigenschaft with id {} DELETED",eigenschaftId);
		
		return ResponseEntity.ok().build();
	}

}
