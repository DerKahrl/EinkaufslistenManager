package einkaufslistenmanager.backend.v2.db.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "gerichte")
public class Gerichte {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "GERI_ID")
  private Integer geriId;
  
  @Column(name = "bezeichnung", length = 64)
  private String bezeichnung;
  
  @Column(name = "zubereitungsdauer", length = 16)
  private String zubereitungsdauer;
  
  @Column(name = "rezept", length = 4096)
  private String rezept;
  
  @Column(name = "schwierigkeitsgrad")
  private Integer schwierigkeitsgrad;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER, mappedBy="gericht")
  private List<Gerichte_enthaelt_produkte> produkte;

  // Getters and setters
  
  /*
  @PersistenceContext(unitName = "my-pu-name")
  EntityManager em;
  
  @PrePersist
  public void prePersist( ) {
	  if ( this.getGeriId() == null ) {
		  
			Gerichte geri1 = new Gerichte();
			  this.setGeriId(geri1.getGeriId());
			  
			  if ( this.getProdukte() != null ) {
				  
				  for ( Gerichte_enthaelt_produkte p : this.getProdukte() ) {
					  
					  if ( p.getProdukt() != null  ) {
					
						  if ( p.getProdukt().getProdId() == null ) {
							  //em.persist( geriProd.getProdukt() );
						  } else{
							  p.setProdukt(
							   em.find(Produkte.class, p.getProdukt().getProdId()));
						  }
					  }
					  
					  p.setGericht(geri1);
				  }
				  
			  }
		  }
  }
  */
  
public Integer getGeriId() {
	return geriId;
}

public String getBezeichnung() {
	return bezeichnung;
}

public String getZubereitungsdauer() {
	return zubereitungsdauer;
}

public String getRezept() {
	return rezept;
}

public Integer getSchwierigkeitsgrad() {
	return schwierigkeitsgrad;
}

//@JsonManagedReference
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public List<Gerichte_enthaelt_produkte> getProdukte() {
	return produkte;
}

public void setGeriId(Integer geriId) {
	this.geriId = geriId;
}

public void setBezeichnung(String bezeichnung) {
	this.bezeichnung = bezeichnung;
}

public void setZubereitungsdauer(String zubereitungsdauer) {
	this.zubereitungsdauer = zubereitungsdauer;
}

public void setRezept(String rezept) {
	this.rezept = rezept;
}

public void setSchwierigkeitsgrad(Integer schwierigkeitsgrad) {
	this.schwierigkeitsgrad = schwierigkeitsgrad;
}

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public void setProdukte(List<Gerichte_enthaelt_produkte> produkteList) {
	this.produkte = produkteList;
}
  
public int hashCode() {
	return this.geriId + this.bezeichnung.hashCode();
}
}