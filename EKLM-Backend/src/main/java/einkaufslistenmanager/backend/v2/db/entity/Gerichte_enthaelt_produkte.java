package einkaufslistenmanager.backend.v2.db.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "gerichte_enthaelt_produkte")
public class Gerichte_enthaelt_produkte {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "GERI_PROD_ID")
	private Integer geriProdId;

	@JoinColumn(name = "GERI_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
    private Gerichte gericht;

	@JoinColumn(name = "PROD_ID", nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Produkt produkt;

    @Column(name = "menge")
    private String menge;

    @Column(name = "einheit")
    private String einheit;

    //@JsonBackReference
    @JsonIgnore
	public Gerichte getGericht() {
		return gericht;
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

	@JsonIgnore
	public void setGericht(Gerichte gericht) {
		this.gericht = gericht;
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