package einkaufslistenmanager.backend.v2.api.controller;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste;
import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste_enhaelt_Produkte;
import einkaufslistenmanager.backend.v2.db.entity.Produkt;
import einkaufslistenmanager.backend.v2.db.repository.EinkaufslisteRepository;
import einkaufslistenmanager.backend.v2.db.repository.ProdukteRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/einkaufsliste/{id}")
@SecurityRequirement(name = "JSESSIONID")
public class EinkaufslisteProduktController {

	private static final Logger logger = LoggerFactory.getLogger(EinkaufslisteProduktController.class);
	
	@Autowired
	private EinkaufslisteRepository einkaufslisteRepository;

	@Autowired
	private ProdukteRepository produkteRepository;

	
	@Autowired
	private HttpSession session;


	/**
	 * Handles a POST request for adding a new {@link Einkaufsliste_enhaelt_Produkte} entity to the {@link Einkaufsliste}.
	 * 
	 * @param eklId ID of the {@link Einkaufsliste}.
	 * @param produkt {@link Einkaufsliste_enhaelt_Produkte} entity to be added.
	 * @return a {@link ResponseEntity} with status OK and the modified {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PostMapping("")
	public ResponseEntity<Einkaufsliste> addProduct(@PathVariable(value = "id") Integer eklId,
			@RequestBody Einkaufsliste_enhaelt_Produkte produkt) {
		final Integer currentUserId = (Integer) session.getAttribute("userId");
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Optional<Einkaufsliste> optEKL = einkaufslisteRepository.findById(eklId);
		if (optEKL.isEmpty()) {
			logger.error("Einkaufsliste with id {} not found!",eklId);
			return ResponseEntity.badRequest().build();
		}

		Produkt prod = produkt.getProdukt();
		if ( prod != null && 
			 prod.getProdId() == -99 ) {
			// Create new Produkt:
			prod.setProdId(null);
			prod.setCommoneinheit(produkt.getEinheit());
			
			produkt.setProdukt( produkteRepository.save(prod) );
			
			logger.info("Created new Produkt {} [{}]",
					produkt.getProdukt().getProdId(),
					produkt.getProdukt().getBezeichnung()
				);
		}
		produkt.setEkliProdId(null);
		produkt.setEinkaufsliste(optEKL.get());

		optEKL.get().getInhalt().add(produkt);
		
		logger.info("Einkaufsliste {} [{}] added product {}",
				optEKL.get().getId(),
				optEKL.get().getBezeichnung(),
				produkt.getProdukt().getBezeichnung()
			);
		return ResponseEntity.ok(einkaufslisteRepository.save(optEKL.get()));
	}
	
	/**
	 * Handles a PUT request for updating a {@link Einkaufsliste_enhaelt_Produkte} entity of the {@link Einkaufsliste}.
	 * 
	 * @param id ID of the {@link Einkaufsliste}.
	 * @param eklProdId ID of the {@link Einkaufsliste_enhaelt_Produkte}.
	 * @param eklProd {@link Einkaufsliste_enhaelt_Produkte} entity to be updated.
	 * @return a {@link ResponseEntity} with status OK and the modified {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@PutMapping("/{eklprod}")
	public ResponseEntity<Einkaufsliste> updateProdukt(@PathVariable(value = "id") Integer id,
			@PathVariable(value = "eklprod") Integer eklProdId, @RequestBody Einkaufsliste_enhaelt_Produkte eklProd) {
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

		for (final Einkaufsliste_enhaelt_Produkte entry : ekl.getInhalt()) {
			if (entry.getEkliProdId() == eklProdId) {

				entry.setEinheit(eklProd.getEinheit());
				entry.setMenge  (eklProd.getMenge  ());
				entry.setProdukt(eklProd.getProdukt());
				
				logger.info("Einkaufsliste [{}] product {} [{}] UPDATED",
						ekl.getBezeichnung(),
						eklProd.getEkliProdId(),
						eklProd.getProdukt().getBezeichnung()
				);


				return ResponseEntity.ok(einkaufslisteRepository.save(ekl));
			}
		}
		logger.error("Einkaufsliste_enhaelt_Produkte with id {} not found!",eklProdId);
		return ResponseEntity.badRequest().build();
	}

	/**
	 * Handles a DELETE request for deleting an existing {@link Einkaufsliste_enhaelt_Produkte}.
	 * 
	 * @param id ID of the {@link Einkaufsliste}.
	 * @param eklProdId ID of the {@link Einkaufsliste_enhaelt_Produkte}.
	 * @return a {@link ResponseEntity} with status OK and the updated {@link Einkaufsliste} entity in the body,
	 * or a {@link ResponseEntity} with status UNAUTHORIZED if the client is not authenticated.
	 */
	@DeleteMapping("/{eklprod}")
	public ResponseEntity<Einkaufsliste> deleteProdukt(@PathVariable(value = "id") Integer id,
			@PathVariable(value = "eklprod") Integer eklProdId) {
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

		for (final Einkaufsliste_enhaelt_Produkte entry : ekl.getInhalt()) {
			if (entry.getEkliProdId() == eklProdId) {

				ekl.getInhalt().remove(entry);
				
				logger.info("Einkaufsliste [{}] product {} [{}] DELETED",
						ekl.getBezeichnung(),
						entry.getEkliProdId(),
						entry.getProdukt().getBezeichnung()
				);
				
				return ResponseEntity.ok(einkaufslisteRepository.save(ekl));
			}
		}
		logger.error("Einkaufsliste_enhaelt_Produkte with id {} not found!",eklProdId);
		return ResponseEntity.badRequest().build();
	}
}