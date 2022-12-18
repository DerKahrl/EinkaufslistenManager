package einkaufslistenmanager.backend.v2.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import einkaufslistenmanager.backend.v2.db.entity.Einkaufsliste;

@Repository
public interface EinkaufslisteRepository extends JpaRepository<Einkaufsliste, Integer> {
}