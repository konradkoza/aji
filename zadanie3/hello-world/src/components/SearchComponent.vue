<template>
    <div class="main container">
        <h1>Baza filmów</h1>
        <form>
            <label for="title" class="form-label">Tytuł</label>
            <input type="text" class="form-control" name="title" id="title" v-model="title"
                placeholder="Podaj tytuł lub fragment tytułu filmu">
            <div class="row">
                <div class="col"><label for="startYear" class="form-label">Rok produkcji od:</label></div>
                <div class="col-md-7"><input type="text" class="form-control" name="startYear" id="startYear"
                        v-model="yearStart" placeholder="Liczba naturalna z przedziału 1900-2019"></div>
            </div>
            <div class="row">
                <div class="col"><label for="endYear" class="form-label">Rok produkcji do:</label></div>
                <div class="col-md-7"><input type="text" class="form-control" name="endYear" id="endYear" v-model="yearEnd"
                        placeholder="Liczba naturalna z przedziału 1900-2019"></div>
            </div>
            <label for="cast" class="form-label">Obsada</label>
            <input type="text" class="form-control" name="cast" id="cast" placeholder="Imię i nazwisko" v-model="cast">
            <button @click.prevent="$emit('searchFilter', { title, yearStart, yearEnd, cast })"
                class="btn btn-primary w-100">Szukaj</button>
        </form>


    </div>
</template>

<script>

import { ref } from "vue"
export default {

    methods: {
        blockRefresh() {

        }
    },
    data() {
        return {

            title: ref(''),
            yearStart: ref(1900),
            yearEnd: ref(2024),
            cast: ref(''),

        }
    }

}
</script>

<style scoped>
.main {
    max-width: 60%;
}

.row {
    margin-top: 20px;
}

.btn {
    margin-top: 20px;
}

h1 {
    margin-top: 8px;
    font-weight: 600;
}
</style>