package einkaufslistenmanager.backend.v2.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

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

import einkaufslistenmanager.backend.v2.db.entity.Gerichte;
import einkaufslistenmanager.backend.v2.db.entity.Gerichte_enthaelt_produkte;
import einkaufslistenmanager.backend.v2.db.repository.GerichteRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/gerichte")
@SecurityRequirement(name = "JSESSIONID")
public class GerichteController {

	private static final Logger logger = LoggerFactory.getLogger(GerichteController.class);
	
	/**
	 * Repository for accessing {@link Gerichte} entities.
	 */
	@Autowired
	private GerichteRepository gerichteRepository;

	/**
	 * HttpSession object for storing session-specific data.
	 */
	@Autowired
	private HttpSession session;

	/**
	 * Handles HTTP GET requests to retrieve all Gerichte objects.
	 * 
	 * @return a ResponseEntity object with an HTTP status of OK and a list of all Gerichte
	 *      objects as the body, or an HTTP status of UNAUTHORIZED if the current session
	 *      does not have a userId attribute.
	 */
	@GetMapping("")
	public ResponseEntity<List<Gerichte>> getAllGerichte() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok().body(gerichteRepository.findAll());
	}

	/**
	 * Handles HTTP GET requests to retrieve a single Gerichte object by its id.
	 * 
	 * @param gerichteId the id of the Gerichte object to retrieve.
	 * @return a ResponseEntity object with an HTTP status of OK and the Gerichte object as the
	 *      body, an HTTP status of BAD_REQUEST if the Gerichte object with the specified id
	 *      does not exist, or an HTTP status of UNAUTHORIZED if the current session does not
	 *      have a userId attribute.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<Gerichte> getGerichteById(@PathVariable(value = "id") Integer gerichteId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Gerichte> gerichte = gerichteRepository.findById(gerichteId);
		if (gerichte.isEmpty()) {
			logger.error("Gericht with id {} not found!",gerichteId);
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok().body(gerichte.get());
	}

	/**
	 * Handles HTTP POST requests to create a new Gerichte object.
	 * 
	 * @param gerichte the Gerichte object to create.
	 * @return a ResponseEntity object with an HTTP status of OK and the created Gerichte object
	 *      as the body, or an HTTP status of UNAUTHORIZED if the current session does not have
	 *      a userId attribute.
	 */
	@Transactional
	@PostMapping("")
	public ResponseEntity<Gerichte> createGerichte(@RequestBody Gerichte gerichte) {

		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		gerichte.setGeriId(null);

		List<Gerichte_enthaelt_produkte> prod = gerichte.getProdukte();

		gerichte.setProdukte(new ArrayList<>());

		final Gerichte gericht = gerichteRepository.save(gerichte);
		
		prod.forEach( s -> s.setGericht(gericht) );
		gericht.setProdukte(prod);
		
		logger.info("Gericht {} with id {} CREATED!",gericht.getBezeichnung(), gericht.getGeriId());
		
		return ResponseEntity.ok().body(gerichteRepository.saveAndFlush(gericht));
	}

	/**
	 * Handles HTTP PUT requests to update an existing Gerichte object.
	 * 
	 * @param gerichteId the id of the Gerichte object to update.
	 * @param gerichteDetails the updated Gerichte object.
	 * @return a ResponseEntity object with an HTTP status of OK and the updated Gerichte object
	 *      as the body, an HTTP status of BAD_REQUEST if the Gerichte object with the specified
	 *      id does not exist, or an HTTP status of UNAUTHORIZED if the current session does not
	 *      have a userId attribute.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Gerichte> updateGerichte(
			@PathVariable(value = "id") Integer gerichteId,
			@RequestBody Gerichte gerichteDetails
		) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Gerichte> optGerichte = gerichteRepository.findById(gerichteId);
		if (optGerichte.isEmpty()) {
			logger.error("Gericht with id {} not found!",gerichteId);
			return ResponseEntity.badRequest().build();
		}

		Gerichte gerichte = optGerichte.get();

		gerichte.setBezeichnung			(gerichteDetails.getBezeichnung			());
		gerichte.setZubereitungsdauer	(gerichteDetails.getZubereitungsdauer	());
		gerichte.setRezept				(gerichteDetails.getRezept				());
		gerichte.setSchwierigkeitsgrad	(gerichteDetails.getSchwierigkeitsgrad	());

		List<Gerichte_enthaelt_produkte> produkte = gerichte.getProdukte();

		for (int i = 0; i < produkte.size(); i++) {
			produkte.remove(i);
		}

		List<Gerichte_enthaelt_produkte> neueProdukte = gerichteDetails.getProdukte();
		for (int i = 0; i < neueProdukte.size(); i++) {
			neueProdukte.get(i).setGericht(gerichte);
			produkte.add(neueProdukte.get(i));
		}

		Gerichte updatedGerichte = gerichteRepository.save(gerichte);
		
		logger.info("Gericht {} with id {} UPDATED!",updatedGerichte.getBezeichnung(), updatedGerichte.getGeriId());
		
		return ResponseEntity.ok(updatedGerichte);
	}

	/**
	 * Handles HTTP DELETE requests to delete an existing Gerichte object.
	 * 
	 * @param gerichteId the id of the Gerichte object to delete.
	 * @return a ResponseEntity object with an HTTP status of OK if the Gerichte object was
	 *      successfully deleted, an HTTP status of BAD_REQUEST if the Gerichte object with the
	 *      specified id does not exist, or an HTTP status of UNAUTHORIZED if the current session
	 *      does not have a userId attribute.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Gerichte> deleteGerichte(@PathVariable(value = "id") Integer gerichteId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Gerichte> gerichte = gerichteRepository.findById(gerichteId);
		if (gerichte.isEmpty()) {
			logger.error("Gericht with id {} not found!",gerichteId);
			return ResponseEntity.badRequest().build();
		}
		gerichteRepository.delete(gerichte.get());
		
		logger.info("Gericht {} with id {} DELETED!",gerichte.get().getBezeichnung(), gerichte.get().getGeriId());
		
		return ResponseEntity.ok().build();
	}
}
