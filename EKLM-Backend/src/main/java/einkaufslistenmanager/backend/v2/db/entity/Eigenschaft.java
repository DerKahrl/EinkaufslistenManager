package einkaufslistenmanager.backend.v2.db.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "eigenschaft")
public class Eigenschaft {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "EIGS_ID")
  private Integer eigsId;
  
  @Column(name = "bezeichnung")
  private String bezeichnung;
  
  @Column(name = "vergleichsgruppe")
  private Integer vergleichsGruppe;
  
  @Column(name = "prio")
  private Integer prio;
  
  @Column(name = "anzeigen")
  private Boolean anzeigen;
  
  @ManyToMany(mappedBy = "eigenschaften")
  private Set<Produkt> produkteMitEigenschaft;

  // Getters and setters
  public Eigenschaft() {}
  public Eigenschaft(int i, String string, int j, int k, boolean b) {
	this.eigsId = i;
	this.bezeichnung = string;
	this.vergleichsGruppe = j;
	this.prio = k;
	this.anzeigen = b;
}

  @JsonIgnore
  public Set<Produkt> getProdukteMitEigenschaft() {
		return produkteMitEigenschaft;
	}
  
  	public Integer getEigsId() {
		return eigsId;
	}
	
	public String getBezeichnung() {
		return bezeichnung;
	}
	
	public Integer getVergleichsGruppe() {
		return vergleichsGruppe;
	}
	
	public Integer getPrio() {
		return prio;
	}
	
	public Boolean getAnzeigen() {
		return anzeigen;
	}

	public void setEigsId(Integer eigsId) {
		this.eigsId = eigsId;
	}
	
	public void setBezeichnung(String bezeichnung) {
		this.bezeichnung = bezeichnung;
	}
	
	public void setVergleichsGruppe(Integer vergleichsGruppe) {
		this.vergleichsGruppe = vergleichsGruppe;
	}
	
	public void setPrio(Integer prio) {
		this.prio = prio;
	}
	
	public void setAnzeigen(Boolean anzeigen) {
		this.anzeigen = anzeigen;
	}
}