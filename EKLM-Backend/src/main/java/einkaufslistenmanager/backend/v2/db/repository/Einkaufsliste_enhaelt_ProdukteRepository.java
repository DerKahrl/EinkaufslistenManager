package einkaufslistenmanager.backend.v2.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste_enhaelt_Produkte;

@Repository
public interface Einkaufsliste_enhaelt_ProdukteRepository extends JpaRepository<Einkaufsliste_enhaelt_Produkte, Integer> {
}