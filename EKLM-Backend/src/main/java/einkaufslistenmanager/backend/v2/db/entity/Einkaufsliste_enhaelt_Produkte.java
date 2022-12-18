package einkaufslistenmanager.backend.v2.db.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "einkaufsliste_enhaelt_produkte")
//@IdClass(Einkaufsliste_enhaelt_ProdukteId.class)
public class Einkaufsliste_enhaelt_Produkte {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "EKLI_PROD_ID")
    private Integer ekliProdId;
	
    @ManyToOne(  )
    @JoinColumn(name = "EKLI_ID", nullable = false)
    private Einkaufsliste einkaufsliste;

    @ManyToOne(  )
    @JoinColumn(name = "PROD_ID", nullable = false)
    private Produkt produkt;

	
    @Column(name = "menge")
    private String menge;

    @Column(name = "einheit")
    private String einheit;

	public Integer getEkliProdId() {
		return ekliProdId;
	}

	@JsonBackReference
	public Einkaufsliste getEinkaufsliste() {
		return einkaufsliste;
	}

	public Produkt getProdukt() {
		return produkt;
	}

	public String getMenge() {
		return menge;
	}

	public String getEinheit() {
		return einheit;
	}

	public void setEkliProdId(Integer ekliProdId) {
		this.ekliProdId = ekliProdId;
	}

	public void setEinkaufsliste(Einkaufsliste einkaufsliste) {
		this.einkaufsliste = einkaufsliste;
	}

	public void setProdukt(Produkt produkt) {
		this.produkt = produkt;
	}

	public void setMenge(String menge) {
		this.menge = menge;
	}

	public void setEinheit(String einheit) {
		this.einheit = einheit;
	} 	
}


