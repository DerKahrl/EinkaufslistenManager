package einkaufslistenmanager.backend.v2.api.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpSession;

import einkaufslistenmanager.backend.v2.api.controller.EigenschaftController;
import einkaufslistenmanager.backend.v2.db.entity.Eigenschaft;
import einkaufslistenmanager.backend.v2.db.repository.EigenschaftRepository;

@ExtendWith(MockitoExtension.class)
class EigenschaftControllerTest {

  @Mock
  private EigenschaftRepository eigenschaftRepository;

  @Mock
  private HttpSession session;
  
  @InjectMocks
  private EigenschaftController eigenschaftController;

  @BeforeEach
  void testInit() {
	  when(session.getAttribute("userId")).thenReturn(1);
  }
  
  @Test
  void testGetAllEigenschaft() {
    List<Eigenschaft> expectedEigenschaften = List.of(
      new Eigenschaft(1, "Bezeichnung1", 1, 1, true),
      new Eigenschaft(2, "Bezeichnung2", 2, 2, false)
    );

    when(eigenschaftRepository.findAll()).thenReturn(expectedEigenschaften);

    List<Eigenschaft> actualEigenschaften = eigenschaftController.getAllEigenschaft().getBody();

    assertEquals(expectedEigenschaften, actualEigenschaften);
  }

  @Test
  void testGetEigenschaftById_whenEigenschaftExists() {
    int eigenschaftId = 1;
    Eigenschaft expectedEigenschaft = new Eigenschaft(1, "Bezeichnung1", 1, 1, true);

    when(eigenschaftRepository.findById(eigenschaftId)).thenReturn(Optional.of(expectedEigenschaft));

    ResponseEntity<Eigenschaft> response = eigenschaftController.getEigenschaftById(eigenschaftId);
    Eigenschaft actualEigenschaft = response.getBody();

    assertTrue(response.getStatusCode().is2xxSuccessful());
    assertEquals(expectedEigenschaft, actualEigenschaft);
  }

  @Test
  void testGetEigenschaftById_whenEigenschaftDoesNotExist() {
    int eigenschaftId = 1;

    when(eigenschaftRepository.findById(eigenschaftId)).thenReturn(Optional.empty());

    ResponseEntity<Eigenschaft> response = eigenschaftController.getEigenschaftById(eigenschaftId);

    assertTrue(response.getStatusCode().is4xxClientError());
  }

  @Test
  void testCreateEigenschaft() {
    Eigenschaft eigenschaftToCreate = new Eigenschaft(0, "Bezeichnung1", 1, 1, true);
    Eigenschaft expectedEigenschaft = new Eigenschaft(1, "Bezeichnung1", 1, 1, true);
    when(eigenschaftRepository.save(eigenschaftToCreate)).thenReturn(expectedEigenschaft);

    Eigenschaft actualEigenschaft = eigenschaftController.createEigenschaft(eigenschaftToCreate).getBody();

    assertEquals(expectedEigenschaft, actualEigenschaft);
    
  }

  @Test
  void testUpdateEigenschaft_whenEigenschaftExists() {
  int eigenschaftId = 1;
  Eigenschaft eigenschaftToUpdate = new Eigenschaft(1, "Bezeichnung1", 1, 1, true);
  Eigenschaft expectedEigenschaft = new Eigenschaft(1, "Bezeichnung2", 2, 2, false);
  
  when(eigenschaftRepository.findById(eigenschaftId)).thenReturn(Optional.of(eigenschaftToUpdate));
  when(eigenschaftRepository.save(eigenschaftToUpdate)).thenReturn(expectedEigenschaft);

  ResponseEntity<Eigenschaft> response = eigenschaftController.updateEigenschaft(eigenschaftId, eigenschaftToUpdate);
  Eigenschaft actualEigenschaft = response.getBody();

  assertTrue(response.getStatusCode().is2xxSuccessful());
  assertEquals(expectedEigenschaft, actualEigenschaft);
  }
}