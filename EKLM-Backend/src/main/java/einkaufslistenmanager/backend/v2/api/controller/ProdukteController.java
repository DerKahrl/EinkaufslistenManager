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

import einkaufslistenmanager.backend.v2.db.entity.Gerichte;
import einkaufslistenmanager.backend.v2.db.entity.Produkt;
import einkaufslistenmanager.backend.v2.db.repository.ProdukteRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/produkte")
@SecurityRequirement(name = "JSESSIONID")
public class ProdukteController {

	private static final Logger logger = LoggerFactory.getLogger(ProdukteController.class);
	
	/**
	 * Repository for accessing {@link Produkt} entities.
	 */
	@Autowired
	private ProdukteRepository produkteRepository;	

	/**
	 * HttpSession object for storing session-specific data.
	 */
	@Autowired
	private HttpSession session;

	/**
	 * Handles HTTP GET requests to retrieve a list of all Produkt objects.
	 * 
	 * @return a ResponseEntity object with an HTTP status of OK and a list of all Produkt objects
	 *      as the body, or an HTTP status of UNAUTHORIZED if the current session does not have a
	 *      userId attribute.
	 */
	@GetMapping("")
	public ResponseEntity<List<Produkt>> getAllProdukte() {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok().body(produkteRepository.findAll());
	}

	/**
	 * Handles HTTP GET requests to retrieve a single Produkt object by its id.
	 * 
	 * @param produktId the id of the Produkt object to retrieve.
	 * @return a ResponseEntity object with an HTTP status of OK and the Produkt object as the
	 *      body, an HTTP status of BAD_REQUEST if the Produkt object with the specified id does
	 *      not exist, or an HTTP status of UNAUTHORIZED if the current session does not have a
	 *      userId attribute.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<Produkt> getProdukteById(@PathVariable(value = "id") Integer produktId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Produkt> produkte = produkteRepository.findById(produktId);
		if (produkte.isEmpty()) {
			logger.error("Produkt with id {} not found!",produktId);
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok().body(produkte.get());
	}

	/**
	 * Handles HTTP POST requests to create a new Produkt object.
	 * 
	 * @param produkt the Produkt object to create.
	 * @return a ResponseEntity object with an HTTP status of OK and the created Produkt object as
	 *      the body, or an HTTP status of UNAUTHORIZED if the current session does not have a
	 *      userId attribute.
	 */
	@PostMapping("")
	public ResponseEntity<Produkt> createProdukt(@RequestBody Produkt produkt) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		produkt = produkteRepository.save(produkt);
		
		logger.info("Produkt {} with id {} CREATED!",produkt.getBezeichnung(), produkt.getProdId());
		
		return ResponseEntity.ok().body(produkt);
	}

	/**
	 * Handles HTTP PUT requests to update an existing Produkt object.
	 * 
	 * @param produktId the id of the Produkt object to update.
	 * @param produkteDetails the updated Produkt object.
	 * @return a ResponseEntity object with an HTTP status of OK and the updated Produkt object as
	 *      the body, an HTTP status of BAD_REQUEST if the Produkt object with the specified id
	 *      does not exist, or an HTTP status of UNAUTHORIZED if the current session does not
	 *      have a userId attribute.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Produkt> updateProdukte(@PathVariable(value = "id") Integer produktId,
			@RequestBody Produkt produkteDetails) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Produkt> produkt = produkteRepository.findById(produktId);
		if (produkt.isEmpty()) {
			logger.error("Produkt with id {} not found!",produktId);
			return ResponseEntity.badRequest().build();
		}
		produkt.get().setBezeichnung	(produkteDetails.getBezeichnung		());
		produkt.get().setIstZutat		(produkteDetails.getIstZutat		());
		produkt.get().setEigenschaften	(produkteDetails.getEigenschaften	());

		Produkt updatedProdukte = produkteRepository.save(produkt.get());
		
		logger.info("Produkt {} with id {} UPDATED!",updatedProdukte.getBezeichnung(), updatedProdukte.getProdId());

		return ResponseEntity.ok(updatedProdukte);
	}

	/**
	 * Handles HTTP DELETE requests to delete an existing Produkt object.
	 * 
	 * @param produktId the id of the Produkt object to delete.
	 * @return a ResponseEntity object with an HTTP status of OK and the deleted Produkt object as
	 *      the body, an HTTP status of BAD_REQUEST if the Produkt object with the specified id
	 *      does not exist, or an HTTP status of UNAUTHORIZED if the current session does not
	 *      have a userId attribute.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Produkt> deleteProdukte(@PathVariable(value = "id") Integer produktId) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<Produkt> optProdukt = produkteRepository.findById(produktId);
		if (optProdukt.isEmpty()) {
			logger.error("Produkt with id {} not found!",produktId);
			return ResponseEntity.badRequest().build();
		}
		
		Produkt produkt = optProdukt.get();
		
		if ( produkt.getProdukteInEKL() != null ) {
			// Produkte aus Einkaufsliste entfernen:

			produkt.getProdukteInEKL().forEach( 
				e -> {
					e.getEinkaufsliste().getInhalt().remove(e);
				}
			);
			
		}

		if ( produkt.getProdukteInGERI() != null ) {
			// Produkte aus Gericht entfernen:
			produkt.getProdukteInGERI().forEach(
				e -> {
					 e.getGericht().getProdukte().remove(e);
				}
			);
		}
		
		produkteRepository.delete(produkt);
		
		logger.info("Produkt {} with id {} DELETED!",produkt.getBezeichnung(), produkt.getProdId());
		
		return ResponseEntity.ok().build();
	}
}
