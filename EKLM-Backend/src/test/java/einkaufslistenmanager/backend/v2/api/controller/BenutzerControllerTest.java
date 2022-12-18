package einkaufslistenmanager.backend.v2.api.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;
import einkaufslistenmanager.backend.v2.db.repository.BenutzerRepository;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import javax.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
public class BenutzerControllerTest {

	@Mock
	private BenutzerRepository benutzerRepository;

	@Mock
	private HttpSession session;
	
	@InjectMocks
	private BenutzerController controller;

	@BeforeEach
	void testInit() {
		when(session.getAttribute("userId")).thenReturn(1);
	}
	
	@Test
	public void testGetAllBenutzer_shouldReturnOk() {
		when(benutzerRepository.findAll()).thenReturn(Arrays.asList(new Benutzer(), new Benutzer()));
		ResponseEntity<List<Benutzer>> response = controller.getAllBenutzer();
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(2, response.getBody().size());
	}

	@Test
	public void testGetBenutzerById_whenBenutzerExists_shouldReturnOk() {
		when(benutzerRepository.findById(1)).thenReturn(Optional.of(new Benutzer()));
		ResponseEntity<Benutzer> response = controller.getBenutzer(1);
		assertEquals(HttpStatus.OK, response.getStatusCode());
	}
}
