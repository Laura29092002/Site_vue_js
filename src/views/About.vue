<template>
  <div v-if="backend == 'ods'">
  <div v-if="items.length > 0" v-for="(tab, index) in tabs" :key="index">
    
    <h1>{{ names[index].replace(/-/g, " ").replace(/_/g, " ") }}</h1>
    <table >
      <thead>
        <tr>
            <th v-for="champ in champs[index]">{{ champ.replace(/-/g, " ").replace(/_/g, " ") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedItems[index]" :key="item.id">
          <td v-for="champ in champs[index]">{{ item.fields[champ] }}</td>
        </tr>
      </tbody>
      <div>
        Page {{ currentPages[index] }} sur {{ numberOfPages[index] }}
      <button class="petit" v-if="  currentPages[index] > 1" href="#" @click.prevent="paginate(currentPages[index] - 1, index)">Précédent</button>
      <button class="petit" v-if="currentPages[index] < numberOfPages[index]" href="#" @click.prevent="paginate(currentPages[index] + 1, index)">Suivant</button>
      
    </div>
      
    </table>
    
    
  </div>
  <div v-else>
      Les données sont en cours de chargement...
    </div>
  </div>
  <div v-else>
    
    <div v-if="tabs.length > 0" v-for="(tab, index) in tabs" :key="index">
      
    <table>
      <thead>
        <tr v-for="champ in Object.entries(tab)[0]">
          
            <th v-if="Object.keys(champ).length > 1" v-for="cle in Object.keys(champ)"> {{ cle }} </th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in paginatedItems[index]">
          <td v-for="valeur in value">
            <div >{{ valeur }}</div>
          </td>
          
        </tr>
      </tbody>
      <div>
        Page {{ currentPages[index] }} sur {{ numberOfPages[index] }}
      <button class="petit" v-if="  currentPages[index] > 1" href="#" @click.prevent="paginate(currentPages[index] - 1, index)">Précédent</button>
      <button class="petit" v-if="currentPages[index] < numberOfPages[index]" href="#" @click.prevent="paginate(currentPages[index] + 1, index)">Suivant</button> 
      
    </div>
    </table>
  </div>
  <div v-else>
    Les données sont en cours de chargement...
  </div>
  </div>
</template>

<script>
export default {
  
  props: ['data'],
  data() {
    
    return {
      url: '',
      items: [],
      champs: [],
      names:[],
      apis: [
      'https://data.unedic.org/api/records/1.0/search/?dataset=nombre-de-frontaliers-et-indemnite-moyenne-par-pays&q=&rows=60&sort=annee&facet=annee&facet=pays&facet=nb_pers&facet=indem_moy',
      'https://data.unedic.org/api/records/1.0/search/?dataset=solde-indemnite-travailleurs-frontaliers-par-pays&q=&rows=50&sort=-annee&facet=annee&facet=pays&facet=indemnisation&facet=remboursements&facet=ratio2&facet=balance&facet=cntry_code&facet=centroid',
      'https://data.unedic.org/api/records/1.0/search/?dataset=evolution_indicateurs_cles_ac&q=&rows=186&sort=-annee_mois&facet=annee_mois&facet=nb_alloc&facet=nb_od&facet=nb_od_ini&facet=nb_reprises&facet=fdd&facet=aj_moy&refine.annee=annee_mois',
      'https://data.unedic.org/api/records/1.0/search/?dataset=financement-de-l-assurance-chomage&q=&rows=11&sort=-column_1&facet=column_1&facet=recettes_total&facet=recettes_autres&facet=depenses_total&facet=depenses_allocations_brutes_et_aides&facet=depenses_retraites&facet=depenses_activite_partielle&facet=depenses_financement_pole_emploi_et_frais_de_recouvrement&facet=depenses_autres&facet=solde_technique',
    'https://data.unedic.org/api/records/1.0/search/?dataset=csp&q=&rows=80&facet=annee&facet=date_long&facet=trimestre&facet=nombre_dentrees_en_csp&facet=moins_d1_an_danciennete&facet=de_1_an_a_moins_de_2_ans_danciennete&facet=2_ans_danciennete_ou_plus',
    //'https://opendata.plus.transformation.gouv.fr/api/records/1.0/search/?dataset=export-indicateurs&q=&rows=345&facet=reseau&facet=intitule_original_de_l_indicateur&facet=intitule_usager_de_l_indicateur&facet=type_d_indicateur&facet=sources_et_methodes&facet=type_d_unite&facet=unite',
    'https://opendata.plus.transformation.gouv.fr/api/records/1.0/search/?dataset=export-resultats&q=&rows=50&facet=code_sp_du_resultat&facet=intitule_du_reseau&facet=typologie&facet=intitule_de_la_structure&facet=code_sp_structure&facet=titre_original_de_l_indicateur',
    'https://opendata.plus.transformation.gouv.fr/api/records/1.0/search/?dataset=export-experiences&q=&rows=160&facet=id_experience&facet=etat_experience&facet=ecrit_le&facet=date_de_publication&facet=titre&facet=description&facet=poste_comme',
    //'https://opendata.plus.transformation.gouv.fr/api/records/1.0/search/?dataset=export-strutures&q=&rows=150&facet=code_sp_de_la_structure&facet=reseau&facet=intitule_de_la_typologie&facet=intitule_de_la_structure&facet=description_de_la_structure&facet=identifiant_de_la_structure&facet=code_sp_structure_parent',
    'https://opendata.plus.transformation.gouv.fr/api/records/1.0/search/?dataset=export-resultats&q=&rows=50&facet=code_sp_du_resultat&facet=intitule_du_reseau&facet=typologie&facet=intitule_de_la_structure&facet=code_sp_structure&facet=titre_original_de_l_indicateur&facet=code_sp_de_l_indicateur',
    'https://data.normandie.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-annuaire-education&q=&rows=80&facet=identifiant_de_l_etablissement&facet=nom_etablissement&facet=type_etablissement&facet=statut_public_prive&facet=code_postal&facet=code_commune&facet=nom_commune&facet=code_departement&facet=code_academie&facet=code_region&facet=ecole_maternelle&facet=ecole_elementaire&facet=voie_generale&facet=voie_technologique&facet=voie_professionnelle&facet=restauration&facet=hebergement&facet=ulis&facet=apprentissage&facet=segpa&facet=section_arts&facet=section_cinema&facet=section_theatre&facet=section_sport&facet=section_internationale&facet=section_europeenne&facet=lycee_agricole&facet=lycee_militaire&facet=lycee_des_metiers&facet=post_bac&facet=appartenance_education_prioritaire&facet=greta&facet=type_contrat_prive&facet=libelle_departement&facet=libelle_academie&facet=libelle_region&facet=nom_circonscription&facet=precision_localisation&facet=etat&facet=ministere_tutelle&facet=multi_uai&facet=rpi_concentre&facet=rpi_disperse&facet=code_nature&facet=libelle_nature&facet=code_type_contrat_prive&facet=pial',
    'https://data.normandie.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre&q=&rows=200&facet=numero_uai&facet=appellation_officielle&facet=secteur_public_prive_libe&facet=code_postal_uai&facet=localite_acheminement_uai&facet=libelle_commune&facet=appariement&facet=localisation&facet=nature_uai&facet=nature_uai_libe&facet=etat_etablissement&facet=etat_etablissement_libe&facet=code_departement&facet=code_region&facet=code_academie&facet=code_commune&facet=libelle_departement&facet=libelle_region&facet=libelle_academie&facet=secteur_prive_code_type_contrat&facet=secteur_prive_libelle_type_contrat&facet=code_ministere&facet=libelle_ministere',
    'https://data.normandie.education.gouv.fr/api/records/1.0/search/?dataset=carte_sports-2022&q=&rows=189&facet=ville&facet=rne&facet=apsa&facet=voie&facet=type_ens&facet=nature&facet=secteur',
    'https://data.normandie.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-ips_colleges&q=&rows=389&facet=rentree_scolaire&facet=academie&facet=code_du_departement&facet=departement&facet=uai&facet=code_insee_de_la_commune&facet=nom_de_la_commune&facet=secteur',
    'https://data.normandie.education.gouv.fr/api/records/1.0/search/?dataset=bassins-d-education-et-de-formation&q=&rows=598&facet=departement_code&facet=libelle_departement&facet=secteur_pu_pr&facet=bef',
    'https://data.ampmetropole.fr/api/records/1.0/search/?dataset=fr-liste-des-bornes-de-charge-irve-du-reseau-metropolitain-larechargeavec-288&q=&rows=279&facet=city&facet=type&facet=owner_name',
    'https://data.ampmetropole.fr/api/records/1.0/search/?dataset=fr-liste-point-irve-du-reseau-metropolitain-larecharge-abbc-1d4d31ca485b&q=&rows=200&facet=city&facet=type&facet=evses_lignes_status&facet=owner_name',
    'https://data.ampmetropole.fr/api/records/1.0/search/?dataset=point-dinteret-datatourisme-multi-niveaux&q=&rows=300&facet=niv0_categorie&facet=niv1_categorie&facet=niv2_categorie&facet=niv3_categorie&facet=niv4_categorie&facet=niv5_categorie&facet=commune&facet=date_deb&facet=date_f&facet=duree&facet=createur_de_la_donnee&facet=date_de_mise_a_jour&facet=sit_diffuseur',
    'https://data.ampmetropole.fr/api/records/1.0/search/?dataset=signalements-engages-au-quotidien-copie&q=&rows=280&facet=territoire&facet=famille&facet=sous_famille&facet=type&facet=ville&facet=date_creation&facet=canalcreation&facet=nom_goupe',
    'https://opendata.cc-lacqorthez.fr/api/records/1.0/search/?dataset=agenda-rss&q=&rows=60&facet=title&facet=link&facet=categorie&facet=geo_lat&facet=code_couleur',
    'https://opendata.cc-lacqorthez.fr/api/records/1.0/search/?dataset=actualites_cclo&q=&rows=35&facet=id&facet=title&facet=link&facet=published',
    'https://opendata.cc-lacqorthez.fr/api/records/1.0/search/?dataset=transport_beecoming&q=&rows=232&facet=titre&facet=telephone&facet=pot_num&facet=commune&facet=code_insee&facet=pot_classifi',
    'https://opendata.cc-lacqorthez.fr/api/records/1.0/search/?dataset=annuaire_ma_cclo&q=&rows=46&facet=label&facet=description&facet=adresse&facet=idtheme&facet=categorie&facet=telephone',
    'https://opendata.cc-lacqorthez.fr/api/records/1.0/search/?dataset=decheterrie_beecoming&q=&rows=7&facet=titre&facet=horaire&facet=adresse&facet=commune&facet=telephone',
    'https://api.agglo-larochelle.fr/production/opendata/api/records/1.0/search/dataset=yelo___disponibilite_des_velos_en_libre_service&rows=122&facet=station_nom&facet=velos_disponibles&facet=accroches_libres&facet=nombre_emplacements',
    
  ],
    tabs: [],
    allAccessURL:[],
    currentPages: [],
    itemsPerPage: 10,
    paginatedItems: [],
    path: this.$route.fullPath.substr(8),
    futureid: '',
    backend: this.$route.fullPath.substr(8),
    id: '',
    
    
    }
  },
  
  methods: {
    
    
    paginate(page, index) {
    this.currentPages[index] = page;
    
    let start = (this.currentPages[index] - 1) * this.itemsPerPage;
    let end = start + this.itemsPerPage;
    if(this.backend == 'ods'){
      this.paginatedItems[index] = this.items[index].slice(start, end);
  }
    else{
      this.paginatedItems[index] = this.items[index][index].slice(start, end);
    }
    
    
  }
},
  computed: {
    numberOfPages() {
      let arr = [];
      for(let  i = 0; i<this.tabs.length; i++){
        if(this.backend == 'ods'){
          arr[i] = Math.ceil(this.items[i].length / this.itemsPerPage)
        }
        else{
          arr[i] = Math.ceil(this.items[i][0].length / this.itemsPerPage)
        }
        
      }
    return arr;
  },
  
  async getData() {
  this.futureid = this.path.indexOf('/?');
  this.path = this.path.substr(0, this.futureid);
  this.backend = this.backend.substr(this.futureid+1);
  this.id = this.backend;
  this.futureid = this.backend.indexOf('/');
  this.backend = this.backend.substr(1, this.futureid-1);
  this.id = this.id.substr(this.futureid+2);
  //console.log(this.backend);
  //console.log(this.id);
  


  
  if(this.backend == 'ods'){
    for (const api of this.apis) {
    if(api.indexOf(this.path) !== -1) {
      const response = await fetch(api);
      const data = await response.json();
      this.items.push(data.records);
      this.champs.push(data.parameters.facet);
      this.tabs.push(api);
      //console.log(this.tabs);
    }
  }
  for (const item of this.items){
      this.names.push(item[0].datasetid);
    }
    for(let i = 0; i < this.tabs.length; i++){
  this.currentPages.push(1);
  this.paginate(this.currentPages[i], i);
}
  //console.log(this.items);
  //console.log(this.names);
  }
  else{
    try {
      const response = await fetch(`../src/views/dcat/${this.id}.rdf`);
      const data = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      xml.querySelectorAll('accessURL').forEach(item => {
        if(item.getAttribute('rdf:resource').indexOf('/json') !== -1) {
          this.allAccessURL.push(item.getAttribute('rdf:resource'))
        }
      });
      
      for (const accessURL of this.allAccessURL) {
        
        const response = await fetch(accessURL);
        const data = await response.json();
        //console.log(data);
        if( data.length != 0 ){
          this.tabs.push(data);
          this.items.push(Object.values(this.tabs));
          this.currentPages.push(1);
          for(let i = 0; i<this.currentPages.length; i++){
            this.paginate(this.currentPages[i], i);
          }
        }
        //console.log(this.tabs.length);
        
        
      }
      
      
      
      
      
    } 
    catch (error) {
      console.error(error);
    }
  }
  

  
  
  
}
  },
async created(){
  await this.getData;


  for(let i = 0; i < this.tabs.length; i++){
    this.currentPages.push(1);
    console.log(this.currentPages);
    this.paginate(this.currentPages[i], i);
  }



},

  
}
</script>



<style>
h1{
  text-align: center;
  color:  darkblue;
  text-decoration : underline;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th{
  background-color:  darkblue;
  color: white;
}
td {
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

.petit{
    background-color: white;
    color: black;
    border: 4px double black;
    width: 130px;
    padding: 10px;
    font-size: 15px;
    
  }
</style>