package jee7fiddle;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

@Stateless
@ApplicationPath("/resources")
@Path("persons")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PersonResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    private List<Person> findPersons() {
        Query query = entityManager.createQuery("SELECT p FROM Person p ORDER BY id");
        return query.getResultList();
    }

    @GET
    public Persons listPersons() {
        Persons persons = new Persons();
        persons.setPersonList(findPersons());
        return persons;
    }
    
    @GET
    @Path("{id}")
    public Person getPerson(@PathParam("id") Long id) {
    	return entityManager.find(Person.class, id);
    }
    
    @POST
    public Person savePerson(Person person) {
    	if(person.getId() == null) {
    		Person personToSave = new Person();
    		personToSave.setId(listPersons().getPersonList().size()+1L);
    		personToSave.setName(person.getName());
    		personToSave.setDescription(person.getDescription());
    		entityManager.persist(person);
    		entityManager.flush();
    		entityManager.refresh(person);
    	} else {
    		Person personToUpdate = getPerson(person.getId());
    		personToUpdate.setName(person.getName());
    		personToUpdate.setDescription(person.getDescription());
    		person = entityManager.merge(personToUpdate);
    	}
    	return person;
    }
    
    @DELETE
    @Path("{id}")
    public void deletePerson(@PathParam("id") Long id) {
    	entityManager.remove(getPerson(id));
    }
}
