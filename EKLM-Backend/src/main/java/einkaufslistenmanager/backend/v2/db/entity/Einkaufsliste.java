package einkaufslistenmanager.backend.v2.db.entity;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "einkaufsliste")
public class Einkaufsliste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EKLI_ID")
    private Integer id;

    @Column(name = "zeitstempel")
    private Date zeitstempel;

    @Column(name = "bezeichnung")
    private String bezeichnung;

    @Column(name = "hinweis")
    private String hinweis;

    @ManyToOne( cascade = CascadeType.DETACH )
    @JoinColumn(name = "BENU_ID")
    private Benutzer besitzer;
    
    @Transient
    private boolean isOwner;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER, mappedBy="einkaufsliste")
    private List<Einkaufsliste_enhaelt_Produkte> inhalt;

    @ManyToMany(mappedBy="accessibleEinkaufslisten")
    private Set<Benutzer> accessibleEinkaufslisten;
    
	public Integer getId() {
		return id;
	}

	public Date getZeitstempel() {
		return zeitstempel;
	}

	public String getBezeichnung() {
		return bezeichnung;
	}

	public String getHinweis() {
		return hinweis;
	}

	@JsonIgnore
	public Benutzer getBesitzer() {
		return besitzer;
	}

	@JsonManagedReference
	public List<Einkaufsliste_enhaelt_Produkte> getInhalt() {
		return inhalt;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setZeitstempel(Date zeitstempel) {
		this.zeitstempel = zeitstempel;
	}

	public void setBezeichnung(String bezeichnung) {
		this.bezeichnung = bezeichnung;
	}

	public void setHinweis(String hinweis) {
		this.hinweis = hinweis;
	}

	@JsonIgnore
	public void setBesitzer(Benutzer besitzer) {
		this.besitzer = besitzer;
	}

	public void setInhalt(List<Einkaufsliste_enhaelt_Produkte> inhalt) {
		this.inhalt = inhalt;
	}   
    
	public Einkaufsliste update( Einkaufsliste neueEKL ) {
		this.besitzer = neueEKL.besitzer;
		this.bezeichnung = neueEKL.bezeichnung;
		this.hinweis = neueEKL.hinweis;
		this.zeitstempel = neueEKL.zeitstempel;
		
		List<Einkaufsliste_enhaelt_Produkte> produkte = inhalt;
	    
	    for( int i = 0; i < produkte.size(); i++ ) {
	    	produkte.remove(i);	    	
	    }

	    List<Einkaufsliste_enhaelt_Produkte> neueProdukte = neueEKL.getInhalt();
	    for( int i = 0; i < neueProdukte.size(); i++ ) {
	    	produkte.add( neueProdukte.get(i) );
	    }
	    return this;		
	}
	
	public boolean getIsOwner() {
		return this.isOwner;
	}
	public void setIsOwner( boolean v ) {
		this.isOwner = v;
	}
	
	@JsonIgnore
	public Set<Benutzer> getAccessibleEinkaufslisten() {
		return this.accessibleEinkaufslisten;
	}
}