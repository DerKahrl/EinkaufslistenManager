package einkaufslistenmanager.backend.v2.db.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.JoinColumn;

@Entity
@Table(name = "benutzer")
public class Benutzer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BENU_ID")
    private Integer id;

    @Column(name = "username", columnDefinition="VARCHAR(64)", nullable = false)
    private String username;

    @Column(name = "passwort", columnDefinition="CHAR(128)", nullable = false)
    private String password;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy="besitzer")
    private List<Einkaufsliste> einkaufslisten;

    @ManyToMany
    @JoinTable(name = "benutzer_zugriff_einkaufsliste",
        joinColumns = @JoinColumn(name = "BENU_ID"),
        inverseJoinColumns = @JoinColumn(name = "EKLI_ID")
    )
    private Set<Einkaufsliste> accessibleEinkaufslisten;

	public Integer getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	public String getPassword() {
		return password;
	}

	public List<Einkaufsliste> getEinkaufslisten() {
		return einkaufslisten;
	}

	public Set<Einkaufsliste> getAccessibleEinkaufslisten() {
		return accessibleEinkaufslisten;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	public void setPassword(String password) {
		this.password = password;
	}

	public void setEinkaufslisten(List<Einkaufsliste> einkaufslisten) {
		this.einkaufslisten = einkaufslisten;
	}

	public void setAccessibleEinkaufslisten(Set<Einkaufsliste> accessibleEinkaufslisten) {
		this.accessibleEinkaufslisten = accessibleEinkaufslisten;
	}
	
	public Benutzer() {}
    
	public Benutzer( String username, String password ) {
		this.username = username;
		this.password = password;
	}
    
}