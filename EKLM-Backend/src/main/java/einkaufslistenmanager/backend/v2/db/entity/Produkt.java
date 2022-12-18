package einkaufslistenmanager.backend.v2.db.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "produkte")
public class Produkt {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "PROD_ID")
  private Integer prodId;
  
  @Column(name = "bezeichnung")
  private String bezeichnung;
  
  @Column(name = "ist_zutat")
  private Boolean istZutat;
  
  @Column(name = "commoneinheit")
  private String commoneinheit;
  
  @ManyToMany
  @JoinTable(name = "produkte_besitzt_eigenschaft",
             joinColumns = @JoinColumn(name = "PROD_ID"),
             inverseJoinColumns = @JoinColumn(name = "EIGS_ID"))
  private Set<Eigenschaft> eigenschaften;

  
  @OneToMany( mappedBy="produkt", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Einkaufsliste_enhaelt_Produkte> produkteEKL;
 
  @OneToMany(mappedBy="produkt", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Gerichte_enthaelt_produkte> produkteGERI;

  // Getters and setters
  
  @JsonIgnore
  public Set<Einkaufsliste_enhaelt_Produkte> getProdukteInEKL() {
		return produkteEKL;
	}
  
  @JsonIgnore
  public Set<Gerichte_enthaelt_produkte> getProdukteInGERI() {
		return produkteGERI;
	}

	public Integer getProdId() {
		return prodId;
	}

	public String getBezeichnung() {
		return bezeichnung;
	}

	public Boolean getIstZutat() {
		return istZutat;
	}

	public Set<Eigenschaft> getEigenschaften() {
		return eigenschaften;
	}

	public void setProdId(Integer prodId) {
		this.prodId = prodId;
	}

	public void setBezeichnung(String bezeichnung) {
		this.bezeichnung = bezeichnung;
	}

	public void setIstZutat(Boolean istZutat) {
		this.istZutat = istZutat;
	}

	public void setEigenschaften(Set<Eigenschaft> eigenschaftList) {
		this.eigenschaften = eigenschaftList;
	}

	public int hashCode() {
		return this.prodId + this.bezeichnung.hashCode();
	}

	public String getCommoneinheit() {
		return commoneinheit;
	}

	public void setCommoneinheit(String commoneinheit) {
		this.commoneinheit = commoneinheit;
	}
}