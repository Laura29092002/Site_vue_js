<template>
    <div>
      
      <li class="liste" v-for="item in items">
        <button @click="showPopup = true, csv = item.url, getCSV">{{ item.name }}</button>
      </li>
  
      <!-- Popup qui contient la datatable -->
      <div v-if="showPopup">
        <div class="popup">
          <!-- Bouton de fermeture de la popup -->
          <button class="petit btn" @click="showPopup = false">Fermer</button>
          <!-- Boutons pour changer de page  -->
          <button class="petit" v-if="currentPage > 1" @click="currentPage--">
            Précédent
          </button>
          <button class="petit" v-if="currentPage < totalPages" @click="currentPage++">
            Suivant
          </button>
          <input class="recherche" type="text" v-model="searchTerm" placeholder="Rechercher..." @input="filterTable"/>
          <table>
            <thead>
              <tr>
                <!-- En-têtes de colonnes -->
                <th class="titre" v-for="column in columns" :key="column">
                  {{ column }}
                  <button
                    class="fleche"
                    v-if="sortColumn === column && sortOrder === 'ascending'"
                    @click="sortTable(column, 'descending')"
                  >
                    &#x25BC;
                  </button>
                  <button
                    class="fleche"
                    v-if="sortColumn === column && sortOrder === 'descending'"
                    @click="sortTable(column, 'ascending')"
                  >
                    &#x25B2;
                  </button>
                  <button
                    class="fleche"
                    v-if="sortColumn !== column"
                    @click="sortTable(column, 'ascending')"
                  >
                    &#x25B2;
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row[0]" >
                <!-- Valeurs de chaque colonne -->
                <td v-for="value in row" :key="value">{{value}}</td>
                <button class="petit" @click="goToAbout( row.url,row.backend, row.id)">ok</button>
                
              </tr>
            </tbody>
          </table>
          <!-- Navigation dans le contenu de la datatable -->
          <div>
            Page {{ currentPage }} sur {{ totalPages }}
            <button class="petit" v-if="currentPage > 1" @click="currentPage--">
              Précédent
            </button>
            <button class="petit" v-if="currentPage < totalPages" @click="currentPage++">
              Suivant
            </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script>
    import Papa from 'papaparse';
    
    
    export default {
      
      data() {
        return {
          items: [
            { name: 'Jeux de données publiés', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065330/export-harvest-20230104-065330.csv' },
            { name: 'Ressources publiées', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065330/export-tag-20230104-065330.csv' },
            { name: 'Réutilisations publiées', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065327/export-reuse-20230104-065327.csv' },
            { name: 'Organisations créées', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065257/export-organization-20230104-065257.csv' },
            { name: 'Tags créés', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065254/export-discussion-20230104-065254.csv' },
            { name: 'Discussions ouvertes', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-065045/export-resource-20230104-065045.csv' },
            { name: 'Moissoneurs', url: 'https://static.data.gouv.fr/resources/catalogue-des-donnees-de-data-gouv-fr/20230104-064629/export-dataset-20230104-064629.csv' }
          ],
          
          csv:'',
          lien:'',
          file: 'https://data.unedic.org/explore/embed/dataset/csp/table/?&static=false&datasetcard=true',
          showPopup: false,
          columns: [],
          rows: [],
          sortColumn: null,
          sortOrder: null,
          currentPage: 1,
          pageSize: 10,
          searchTerm: '',
          filteredRows: [],
        };
      },
      computed: {
        
        getCSV(){
          Papa.parse(this.csv, {
        download: true,
        header: true,
        complete: (results) => {
          
          // Récupération des en-têtes de colonnes et des lignes de données
          this.columns = results.meta.fields;
          this.filteredRows = results.data;
          this.rows = results.data;
          this.paginatedRows = this.filteredRows.slice(0, this.pageSize);
        },
      });
        },
        
    
         
        totalPages() {
      return Math.ceil(this.sortedRows.length / this.pageSize);
    },
        
        paginatedRows() {
      // Si la barre de recherche n'est pas vide, afficher les lignes filtrées
      // Sinon, afficher l'ensemble du contenu de la datatable
      return this.searchTerm
        ? this.filteredRows
        : this.sortedRows.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
    },
        sortedRows() {
          // Trie les lignes en fonction de la colonne et de l'ordre de tri sélectionnés
  
        if (!this.sortColumn) {
          return this.filteredRows;
        }
        return this.filteredRows.sort((a, b) => {
          let sortValue;
          if (this.sortOrder === 'ascending') {
            sortValue = a[this.sortColumn].localeCompare(b[this.sortColumn]);
          } else {
            sortValue = b[this.sortColumn].localeCompare(a[this.sortColumn]);
          }
          return sortValue;
        });
      },
      
    },
    
  
    
    methods: {
      goToAbout(row, be, id){
    
        this.$router.push(`/about/?${row}/?${be}/?${id}`)
     },
      filterTable() {
    // Si la barre de recherche est vide, on réinitialise
    if (this.searchTerm === '') {
      this.filteredRows = this.sortedRows;
    } else {
      // Mettre à jour la variable de filtre en fonction du terme de recherche
      this.filteredRows = this.sortedRows.filter(row => {
        for (let key in row) {
          if (
            row[key]
              .toString()
              .toLowerCase()
              .indexOf(this.searchTerm.toLowerCase()) !== -1
          ) {
            return true;
          }
        }
        return false;
      });
    }
    this.currentPage = 1;
  },
  
    
    paginate() {
    // Calculez le numéro de la première et de la dernière ligne de la page courante
    const start = (this.currentPage - 1) * this.pageSize
    const end = start + this.pageSize
  
    // Sélectionnez les lignes de la page courante à partir du tableau filtré
    this.paginatedRows = this.filteredRows.slice(start, end)
  },
      sortTable(column) {
        // Trie la table en fonction de la colonne sélectionnée
        if (this.sortColumn === column) {
          this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
        } else {
          this.sortColumn = column;
          this.sortOrder = 'ascending';
        }
      },
  
     
  
    }
  };
  </script>
  
  <style>
  .titre{
    font-size: 15px;
  }
  button {
          display: inline-block;
          background-color: darkblue;
          border-radius: 10px;
          border: 4px double #cccccc;
          color: #eeeeee;
          text-align: center;
          font-size: 18px;
          padding: 20px;
          width: 200px;
          transition: all 0.5s;
          cursor: pointer;
          margin: 5px;
          
        }
  
  .liste{
    list-style-type:none;
    display: flex;
    justify-content: center;
    
  }
  
  .petit{
    color: black;
    border: 4px double black;
    width: 130px;
    padding: 10px;
    font-size: 15px;
    
  }
  .fleche{
    border: none;
    width: 4px;
    font-size: 10px;
  }
  .btn{
    
    float:right;   
    
  }

  .recherche{
    border-radius: 5px;
    width: 500px;
  }
  /* Styles pour la popup */
  
  
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    z-index: 100000;
    width: 80%;
    max-width: 1100px;
    height: 80%;
    max-height: 600px;
    overflow: auto;
    border: solid gray 1px;
    border-radius: 5px;
  }

  
  
  /* Styles pour la datatable */
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    border: none;
    text-align: left;
    color: #000000;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: white;
    
  }
  
  tr:nth-child(odd) {
    background-color: white;
    border: 1px solid black;
    border-left: none;
    border-right: none;
  }


  
  </style>
  