<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },

  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
    };
  },

  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },

  computed: {
    // Ghép chuỗi để tìm kiếm
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;
        return [name, email, address, phone].join("").toLowerCase();
      });
    },

    // Lọc danh sách
    filteredContacts() {
      if (!this.searchText) return this.contacts;

      return this.contacts.filter((_contact, index) =>
        this.contactStrings[index].includes(
          this.searchText.toLowerCase()
        )
      );
    },

    // Contact đang chọn
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },

    // Số lượng
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },

  methods: {
    // Lấy dữ liệu từ server
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    // Refresh
    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },

    // Xóa tất cả
    async removeAllContacts() {
      if (confirm("Bạn muốn xóa tất cả liên hệ?")) {
        try {
          await ContactService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },

    // Chuyển sang trang thêm
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },

    // Chuyển sang trang sửa
    goToEditContact() {
      if (this.activeContact) {
        this.$router.push(`/contacts/${this.activeContact._id}`);
      }
    },
  },

  mounted() {
    this.refreshList();
  },
};
</script>

<template>
  <div class="page row">
    <!-- SEARCH -->
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <!-- LIST -->
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>

      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />

      <p v-else>Không có liên hệ nào.</p>

      <!-- BUTTON -->
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fas fa-redo"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <!-- DETAIL -->
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>

        <ContactCard :contact="activeContact" />

        <!-- EDIT BUTTON -->
        <button
          class="btn btn-warning mt-3"
          @click="goToEditContact"
        >
          <i class="fas fa-edit"></i> Hiệu chỉnh
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>