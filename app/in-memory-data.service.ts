import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: "11a", name: 'Mr. nottty' },
      { id: "12b", name: 'Narco' },
      { id: "13c", name: 'Bombasto' },
      { id: "14d", name: 'Celeritas' },
      { id: "15e", name: 'Magneta' },
      { id: "16f", name: 'RubberMan' },
      { id: "17g", name: 'Dynama' },
      { id: "18h", name: 'Dr IQ' },
      { id: "19i", name: 'Magma' },
      { id: "20j", name: 'Tornado' }
    ];
   
    return {heroes};
  }
}