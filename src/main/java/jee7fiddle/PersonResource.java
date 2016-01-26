package jee7fiddle;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

@Stateless
@ApplicationPath("/resources")
@Path("persons")
public class PersonResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    private Integer countPersons() {
        Query query = entityManager.createQuery("SELECT COUNT(p.id) FROM Person p");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Person> findPersons() {
        Query query = entityManager.createQuery("SELECT p FROM Person p ORDER BY id");
        return query.getResultList();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Persons listPersons() {
        Persons persons = new Persons();
        persons.setPersonList(findPersons());
        return persons;
    }
}
