package einkaufslistenmanager.backend.v2.db.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import einkaufslistenmanager.backend.v2.db.entity.Benutzer;

@Repository
public interface BenutzerRepository extends JpaRepository<Benutzer, Integer> {

	Optional<Benutzer> findByUsernameAndPassword( String Username, String Password );

}