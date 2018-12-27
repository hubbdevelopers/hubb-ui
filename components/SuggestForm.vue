<template>
<div>
  <vue-autosuggest
      :suggestions="filteredOptions"
      @focus="focusMe"
      @click="clickHandler"
      :on-selected="onSelected"
      :render-suggestion="renderSuggestion"
      :get-suggestion-value="getSuggestionValue"
      :input-props="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'アカウントIDを入力'}"/>
</div>
</template>
<script>
import { db } from '~/plugins/firebase'
import { VueAutosuggest } from "vue-autosuggest";

export default {
    components: {
      VueAutosuggest
    },
    data() {
        return {
            selected: "",
            filteredOptions: [],
            suggestions: [
                {
                data: []
                }
            ]
        }
    },
    mounted() {

        const usersRef = db.collection("/users")
        usersRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.suggestions[0].data.push({id: doc.id, data:doc.data()})
            });
        });
        
    },
    methods: {
    onInputChange(text, oldText) {
      if (!text) {
        /* Maybe the text is null but you wanna do
        *  something else, but don't filter by null.
        */
        return;
      }

      // Full customizability over filtering
      const filteredData = this.suggestions[0].data.filter(option => {
        return option.id.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      // Store data in one property, and filtered in another
      this.filteredOptions = [{ data: filteredData }];

      //console.log(this.filteredOptions)
    },
    clickHandler(item) {
      // items are selected by default on click, but you can add some more behavior here!
    },
    onSelected(item) {
      this.selected = item;
      this.$emit('enter', item)
    },
    /**
     * renderSuggestion will override the default suggestion template slot.
     */
    renderSuggestion(suggestion) {
      /* You will need babel-plugin-transform-vue-jsx for this kind of syntax for
       * rendering. If you don't use babel or the jsx transform, then you can create 
       * the you can create the virtual node yourself using this.$createElement.
       */
      const character = suggestion.item;
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <img
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "15px",
              marginRight: "10px"
            }}
            src={character.image}
          />{" "}
          <span style={{ color: "navyblue" }}>{character.account_id} : {character.name}</span>
        </div>
      );
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.id + ':' + suggestion.item.data.name;
    },
    focusMe(e) {
      console.log(e)
    }
  }
}
</script>
<style>
    
    #autosuggest__input {
        
      outline: none;
      position: relative;
      display: block;
      border: 1px solid #616161;
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
    }
    
    #autosuggest__input.autosuggest__input-open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    .autosuggest__results-container {
      position: relative;
      width: 100%;
    }
    
    .autosuggest__results {
      font-weight: 300;
      margin: 0;
      position: absolute;
      z-index: 10000001;
      width: 100%;
      border: 1px solid #e0e0e0;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background: white;
      padding: 0px;
    }
    
    .autosuggest__results ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    
    .autosuggest__results .autosuggest__results_item {
      cursor: pointer;
      padding: 15px;
    }
    
    #autosuggest ul:nth-child(1) > .autosuggest__results_title {
      border-top: none;
    }
    
    .autosuggest__results .autosuggest__results_title {
      color: gray;
      font-size: 11px;
      margin-left: 0;
      padding: 15px 13px 5px;
      border-top: 1px solid lightgray;
    }
    
    .autosuggest__results .autosuggest__results_item:active,
    .autosuggest__results .autosuggest__results_item:hover,
    .autosuggest__results .autosuggest__results_item:focus,
    .autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted {
      background-color: #F6F6F6;
    }

</style>