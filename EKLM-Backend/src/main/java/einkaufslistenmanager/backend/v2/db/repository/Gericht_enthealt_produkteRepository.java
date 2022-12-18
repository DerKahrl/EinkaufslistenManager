package einkaufslistenmanager.backend.v2.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import einkaufslistenmanager.backend.v2.db.entity.Gerichte_enthaelt_produkte;

@Repository
public interface Gericht_enthealt_produkteRepository extends JpaRepository<Gerichte_enthaelt_produkte, Integer> {
}