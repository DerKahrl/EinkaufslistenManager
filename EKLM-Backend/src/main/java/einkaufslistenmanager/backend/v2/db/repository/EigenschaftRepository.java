package einkaufslistenmanager.backend.v2.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import einkaufslistenmanager.backend.v2.db.entity.Eigenschaft;

@Repository
public interface EigenschaftRepository extends JpaRepository<Eigenschaft, Integer> {
}