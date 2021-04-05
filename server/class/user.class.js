
class User {
    constructor() {
        this.peoples = [];
    }

    addPeople(id, name, room) {
        let people = { id, name, room };
        this.peoples.push(people);

        return this.peoples;
    }

    getPeople(id) {
        let people = this.peoples.find(p => id === p.id);
        return people;
    }

    getPeoples() {
        return this.peoples;
    }

    getPeopleByRoom(room) {
        let peoplesRoom = this.peoples.filter(p => p.room === room);
        return peoplesRoom;
    }

    removePeople(id) {
        let people = this.getPeople(id);

        // Filtrar las personas que sean diferentes al ID referenciado
        this.peoples = this.peoples.filter(people => people.id !== id);
        
        return people;
    }
}

module.exports = {
    User
};
