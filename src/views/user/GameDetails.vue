<template>
  <div>
    <div class="common-layout">
      <!--      <navBar />-->
      <el-container v-loading="loading">
        <el-main>
          <div class="main_header">
            <!-- Game details and platform -->
            <div class="main_header_left">
              <div class="main_header_left_text">
                <div>Game Details</div>
              </div>
              <div></div>
            </div>
            <!-- Right hand side header icons -->
            <div class="main_header_right">
              <div>
                <el-dropdown>
                  <el-icon :size="30" color="#FFF">
                    <Edit />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :icon="Edit" @click="toggleEdit"
                      >Toggle Edit
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="openUploader('icon')"
                        :icon="Picture"
                      >Update Icon Image
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="openUploader('cover')"
                        :icon="Picture"
                      >Update Cover Image
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="openUploader('capsule')"
                        :icon="Picture"
                      >Update Capsule Image
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="openUploader('background')"
                        :icon="Picture"
                      >Update Background Image
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="openUploader('screenshot')"
                        :icon="Picture"
                      >Add Screeshots
                      </el-dropdown-item>
                      <el-dropdown-item
                        :disabled="!editEnabled"
                        @click="onDeleteGame"
                        :icon="CircleClose"
                      >Delete Game</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          <!-- Details: name, time -->
          <div class="detailtitle">
            <el-row :gutter="20">
              <!-- cover image -->
              <el-col :span="4">
                <el-dropdown trigger="hover" :disabled="!editEnabled">
                  <div class="detailtitle_cover" @click="openUploader('cover')">
                    <div>
                      <img
                        class="detail_img"
                        :src="game.cover_image"
                        alt="cover image"
                      />
                    </div>
                    <div class="playbutton">
                      <img :src="PC_PNG" alt="play" />
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="openUploader('cover')"
                        :icon="CirclePlus"
                      >Click to Update Cover Image
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
              <!-- game name -->
              <el-col :span="10" style="padding-left: 0px">
                <div class="detailtitle_right">
                  <div class="game_name">
                    <el-tooltip
                      effect="dark"
                      content="Click to Edit Game Name"
                      placement="bottom-start"
                      trigger="hover"
                      :disabled="!editEnabled"
                      v-if="!nameInput"
                    >
                      <span>
                        <div
                          v-if="!nameInput"
                          class="detail_name"
                          @click="editText('name')"
                        >
                          {{ game.game_name }}
                        </div>
                      </span>
                    </el-tooltip>
                    <el-tooltip
                      v-if="nameInput"
                      effect="dark"
                      content="Hit Enter to Submit"
                      placement="bottom-start"
                      trigger="hover"
                      :disabled="!editEnabled"
                    >
                      <el-input
                        v-if="nameInput"
                        @keyup.enter="submitText('name')"
                        v-model="newName"
                        type="textarea"
                        @keyup.space="newName = newName + ' '"
                        autosize
                        :placeholder="game.game_name"
                      ></el-input>
                    </el-tooltip>
                  </div>
                  <el-button v-if="nameInput" @click="editText('name')">
                    <el-icon>
                      <Close />
                    </el-icon>
                  </el-button>
                  <el-button
                    style="margin-left: 0px"
                    v-if="nameInput"
                    @click="submitText('name')"
                  >
                    Done
                  </el-button>

                  <!-- duration -->
                  <div v-if="timeMins / 60 < 1">
                    {{ timeMins }} Minutes Played
                  </div>
                  <div v-else>{{ timeHours }} Hours Played</div>
                  <!-- expect time -->
                  <div style="margin-top: 10px">
                    <div style="display: flex">
                      <el-tooltip
                        effect="dark"
                        content="Click to Enter Estimated Play Time"
                        placement="bottom-start"
                        trigger="hover"
                        :disabled="!editEnabled"
                        v-if="!expectInput"
                      >
                        <span>
                          <div
                            v-if="!expectInput"
                            class=""
                            @click="editText('time')"
                          >
                            <div v-if="expectTime > 0">
                              {{ expectTime }} Hours of Estimated Play Time
                            </div>
                            <div v-else>No Estimated Play Time</div>
                          </div>
                        </span>
                      </el-tooltip>
                      <el-tooltip
                        v-if="expectInput"
                        effect="dark"
                        content="Enter Estimated Play Time in Hours"
                        placement="bottom-start"
                        trigger="hover"
                        :disabled="!editEnabled"
                      >
                        <el-input-number
                          v-if="expectInput"
                          @keyup.enter="submitText('time')"
                          v-model="newExpectTime"
                          :min="0"
                          :precision="2"
                          :step="0.1"
                        />
                      </el-tooltip>
                      <el-button v-if="expectInput" @click="editText('time')">
                        <el-icon>
                          <Close />
                        </el-icon>
                      </el-button>
                      <el-button
                        style="margin-left: 0px"
                        v-if="expectInput"
                        @click="submitText('time')"
                      >
                        Done
                      </el-button>
                    </div>
                  </div>
                  <!-- Game Tags  -->
                  <div class="detail_time">
                    <el-tag
                      v-for="tag in allTags"
                      :key="tag.TagID"
                      class="mx-1"
                      :closable="editEnabled"
                      :disable-transitions="false"
                      @close="handleDelete(tag)"
                    >
                      {{ tag.Name }}
                    </el-tag>

                    <div
                      v-if="editEnabled"
                      style="display: flex; margin-top: 1px"
                    >
                      <el-select
                        size="small"
                        v-if="showTagInput"
                        ref="newTagRef"
                        v-model="tagInputValue"
                        :reserve-keyword="false"
                        placeholder="+ New Tag"
                        multiple
                        clearable
                        default-first-option
                        filterable
                        @click="displayOptionDeleteBtn"
                        @keyup="displayOptionDeleteBtn"
                        allow-create
                      >
                        <div
                          class="options"
                          v-for="item in defaultTags"
                          :key="item.ID"
                        >
                          <el-option :value="item.Name" :id="item.ID">{{
                            item.Name
                          }}</el-option
                          ><el-icon
                            :id="item.ID + 'Btn'"
                            @click="deteleTagFromRemote(item)"
                            class="deleteBtn"
                          ><CloseBold
                          /></el-icon>
                        </div>
                      </el-select>
                      <el-button
                        v-else
                        class="button-new-tag ml-1"
                        size="small"
                        @click="toggleInput"
                      >
                        + New Tag
                      </el-button>
                      <el-button
                        v-if="showTagInput"
                        @click="handleInputConfirm"
                        style="margin-left: 0"
                      >Done</el-button
                      >
                    </div>
                  </div>

                  <!-- Game recording time -->
                  <div class="play">
                    <div style="display: flex">
                      <el-button
                        v-if="start"
                        @click="record('start')"
                        type="warning"
                      >
                        <el-icon style="vertical-align: middle">
                          <VideoPlay />
                        </el-icon>
                        <span style="vertical-align: middle"
                        >Start Play Timing</span
                        >
                      </el-button>

                      <el-button
                        v-if="!start"
                        @click="record('stop')"
                        type="warning"
                      >
                        <el-icon style="vertical-align: middle">
                          <VideoPause />
                        </el-icon>
                        <span style="vertical-align: middle"
                        >Stop Play Timing</span
                        >
                      </el-button>

                      <el-dropdown
                        v-if="editEnabled"
                        trigger="hover"
                        style="margin-left: 10px"
                      >
                        <el-icon :size="30" color="#FFF">
                          <Calendar />
                        </el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              @click="toggleCalender('calender')"
                              :icon="Calendar"
                            >Click to Enter Time Played Manually by Dates
                            </el-dropdown-item>
                            <el-dropdown-item
                              @click="toggleCalender('time')"
                              :icon="Calendar"
                            >Click to Enter Time Played Manually by Minutes or
                              Hours
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <!-- Rating -->
                    <div class="play_icon_star">
                      <span>
                        <el-rate
                          :disabled="!editEnabled"
                          @click="onChangeRate"
                          v-model="rateValue"
                          :color="colors"
                          allow-half
                          disabled-void-icon="Star"
                        />
                      </span>
                    </div>
                  </div>
                  <!-- Game description -->
                  <div>
                    <el-tooltip
                      effect="dark"
                      content="Click to Edit Description"
                      placement="bottom-start"
                      trigger="hover"
                      :disabled="!editEnabled"
                      v-if="!textInput"
                    >
                      <span>
                        <div
                          v-if="!textInput"
                          @click="editText('description')"
                          class="detail_content description"
                          style="white-space: pre"
                        >
                          {{ game.description }}
                        </div>
                      </span>
                    </el-tooltip>
                    <div class="descriptionBox">
                      <div v-if="textInput" class="detail_content description">
                        <el-input
                          v-if="textInput"
                          v-model="text"
                          type="textarea"
                          :autosize="{ minRows: 3 }"
                          :placeholder="game.description"
                        ></el-input>
                      </div>
                    </div>
                    <el-button
                      v-if="textInput"
                      @click="editText('description')"
                    >
                      <el-icon>
                        <Close />
                      </el-icon>
                    </el-button>

                    <el-button
                      style="margin-left: 0px"
                      v-if="textInput"
                      @click="submitText('description')"
                    >
                      Done
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- screen shots display -->
          <div class="screenshotlist">
            <div class="screenshotlist_title">Screenshots Display</div>
            <div class="screenshotlist_title" v-if="!hasScreenShot">
              No Screenshot Yet!
            </div>
            <div v-else class="screenshotcontent">
              <el-row>
                <el-col
                  v-for="photo in game.screen_shot"
                  :key="photo.ID"
                  :span="3"
                >
                  <el-dropdown trigger="hover" :disabled="!editEnabled">
                    <div class="screenshotcontent_list">
                      <div class="screenshotphoto">
                        <a :href="photo.Path" target="_blank">
                          <img v-lazy="photo.Path" alt="" />
                        </a>
                      </div>
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          @click="onDeleteScreenShot(photo.ID)"
                          :icon="CircleClose"
                        >Delete Screenshot
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="backimg">
      <img :src="game.background" alt="" />
    </div>
    <div class="backcolor"></div>
    <ImageWindow
      v-if="showUploader"
      @resetParent="onReset"
      :items="info"
      :gameId="game.game_id"
    />

    <el-dialog
      class="datePicker"
      v-model="showDialog"
      title="Enter Time Played In This Game"
      width="30%"
      align-center
    >
      <span v-if="calenderMode">
        <h3>Date and time:</h3>
        <Datepicker v-model="recordDate" range></Datepicker>
      </span>

      <span v-else>
        <h3>Enter Time Played:</h3>
        <div style="display: flex">
          <el-input-number
            @keyup.enter="submitTime"
            v-model="timeInput"
            :min="0"
            :precision="2"
            :step="0.1"
          />
          <el-select v-model="timeUnit" class="m-2" placeholder="Select">
            <el-option
              v-for="item in timeOption"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitTime">Submit</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// import navBar from '@/components/NavBar.vue';
  import router from "@/router";
  import {
    CirclePlus,
    CircleClose,
    Picture,
    Edit,
    Calendar,
  } from "@element-plus/icons-vue";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import { ref, reactive, onMounted, watch } from "vue";
  import {
    gameDetails,
    listGame,
    addTagToGame,
    removeTag,
    editGame,
    deleteGame,
    deleteScreenShot,
    startRecord,
    endRecord,
    fullRecord,
  } from "@/api/game.js";
  import { listTags, addTag, deleteTag } from "@/api/tags.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  import ImageWindow from "@/components/userView/ImageWindow.vue";
  import PC_PNG from "@/assets/default/playOrange.png";
  const store = useStore();

  // tag container
  const tagInputValue = ref([]);
  const showTagInput = ref(false);
  const allTags = ref([]);
  const defaultTags = ref([]);
  const newTagRef = ref(null);
  // data containers
  const game = reactive({});
  const loading = ref(true);
  const route = useRoute();
  const list = ref();
  const loadData = ref(false);

  //edit data container
  const showUploader = ref(false);
  const info = ref("");
  const textInput = ref(false);
  const text = ref("");
  const newName = ref("");
  const nameInput = ref(false);
  const newExpectTime = ref(0);
  const expectInput = ref(false);
  const expectTime = ref(0);
  const rateValue = ref(0);
  const colors = ref({
    2: "#99A9BF",
    4: { value: "#F7BA2A", excluded: true },
    5: "#FF9900",
  });
  const start = ref(true);
  const timeMins = ref(0);
  const timeHours = ref(0);
  const recordDate = ref([]);
  const showDialog = ref(false);
  const hasScreenShot = ref(false);
  const editEnabled = ref(false);
  const calenderMode = ref(true);
  const timeUnit = ref("Hours");
  const timeInput = ref(0);

  const timeOption = [
    {
      name: "Hours",
    },
    {
      name: "Minutes",
    },
  ];

  const toggleCalender = (val) => {
    showDialog.value = true;
    if (val === "time") {
      calenderMode.value = false;
    } else {
      calenderMode.value = true;
    }
  };

  const toggleEdit = () => {
    editEnabled.value = !editEnabled.value;
  };

  const fetchNewData = () => {
    gameDetails({ gameId: route.params.id })
      .then((response) => {
        if (JSON.stringify(response.data) !== "{}") {
          Object.assign(game, response.data);
        }
        console.log("response", response.data);
        console.log("game", game);
        timeMins.value = (game.total_duration / 60).toFixed(2);
        timeHours.value = (timeMins.value / 60).toFixed(2);
        expectTime.value = (game.expected_time / 60 / 60).toFixed(2);
        text.value = "";
        newName.value = "";
        textInput.value = false;
        nameInput.value = false;
        expectInput.value = false;
        getScreenShotNum();
      })
      .catch((error) => {
        console.log("fetching game: ", error);
      });
  };

  const displayOptionDeleteBtn = () => {
    defaultTags.value.forEach((tag) => {
      let element = document.getElementById(tag.ID);
      let elementBtn = document.getElementById(tag.ID + "Btn");
      if (
        (element && element.style.display === "none") ||
        element.innerText === "Incompleted" ||
        element.innerText === "Completed" ||
        element.innerText === "Favourite"
      ) {
        elementBtn.style.display = "none";
      } else {
        elementBtn.style.display = "block";
      }
    });
  };

  const fetchNewGameList = async () => {
    await listGame().then((response) => {
      if (JSON.stringify(response.data) !== "{}") {
        list.value = response.data;
        store.commit("layout/SET_GAME_LIST", response.data);
      }
      loadData.value = true;
      store.commit("layout/SET_GAME_LIST", response.data);
    });
  };

  const getScreenShotNum = () => {
    if (Object.keys(game.screen_shot).length === 0) {
      hasScreenShot.value = false;
    } else {
      hasScreenShot.value = true;
    }
  };

  const isOverlap = (start, end, duration) => {
    var startTime = start;
    const records = JSON.parse(JSON.stringify(game.records));
    var endTime = end;

    for (var i = 0; i < records.length; i++) {
      var recStart = new Date(records[i].StartTime).valueOf();
      var recEnd = new Date(records[i].EndTime).valueOf();
      if (
        (startTime < recStart && endTime < recStart) ||
        (startTime > recEnd && endTime > recEnd)
      ) {
        return [startTime, endTime];
      } else {
        startTime = recEnd;
        endTime = startTime + duration;
      }
    }
    return [startTime, endTime];
  };

  const submitTime = () => {
    if (calenderMode.value === false) {
      console.log(timeUnit.value);
      console.log(timeInput.value);
      if (timeInput.value && timeInput.value > 0 && timeUnit.value) {
        var endTime = 0;
        var startTime = 0;
        if (timeUnit.value === "Hours") endTime = timeInput.value * 3600 * 1000;
        else {
          endTime = timeInput.value * 60 * 1000;
        }
        const timeArray = isOverlap(startTime, endTime, endTime - startTime);
        const start = timeArray[0] / 1000;
        const end = timeArray[1] / 1000;
        fullRecord({
          GameID: game.game_id,
          Start: start,
          End: end,
        })
          .then((response) => {
            ElMessage({
              message: response.message || "Update time played",
              type: "success",
              duration: 3 * 1000,
            });
            fetchNewData();
            showDialog.value = false;
            timeInput.value = 0;
            timeUnit.value = "Hours";
            calenderMode.value = true;
          })
          .catch((err) => {
            console.log("Error in full record:", err);
          });
      } else {
        ElMessage.error("Invalid time played");
      }
    } else {
      if (Object.keys(recordDate.value).length > 0) {
        console.log("time:", recordDate.value);
        const startTime = Math.floor(
          new Date(recordDate.value[0]).valueOf() / 1000
        );
        const endTime = Math.floor(
          new Date(recordDate.value[1]).valueOf() / 1000
        );
        fullRecord({
          GameID: game.game_id,
          Start: startTime,
          End: endTime,
        })
          .then((response) => {
            ElMessage({
              message: response.message || "Update time played",
              type: "success",
              duration: 3 * 1000,
            });
            fetchNewData();
            showDialog.value = false;
            recordDate.value = [];
          })
          .catch((err) => {
            console.log("Error in full record:", err);
          });
      } else {
        ElMessage.error("Input time can't be empty");
      }
    }
  };

  const record = (val) => {
    if (val === "start") {
      startRecord({ Id: game.game_id })
        .then((response) => {
          console.log("response:", response.data);
          if (response.success) {
            ElMessage({
              message: response.message || "Start timing",
              type: "success",
              duration: 3 * 1000,
            });
            start.value = false;
          }
        })
        .catch((err) => {
          console.log("Err in start recording:", err);
          if (err.response.data.message === "Game maybe still on timing") {
            start.value = false;
          }
        });
    } else if (val === "stop") {
      endRecord({ Id: game.game_id }).then((response) => {
        ElMessage({
          message: response.message || "End recording",
          type: "success",
          duration: 3 * 1000,
        });
        start.value = true;
        fetchNewData();
      });
    }
  };

  // enable description or game name input
  const editText = (val) => {
    if (!editEnabled.value) {
      return;
    }
    if (val === "description") {
      textInput.value = !textInput.value;
    } else if (val === "name") {
      nameInput.value = !nameInput.value;
    } else if (val === "time") {
      expectInput.value = !expectInput.value;
    }
    text.value = "";
    newName.value = "";
    newExpectTime.value = 0;
  };

  // submit edit request for description or game name
  const submitText = async (val) => {
    if (val === "description") {
      await editGame({ GameID: game.game_id, Description: text.value }).then(
        (response) => {
          ElMessage({
            message: response.message || "Update description successfully!",
            type: "success",
            duration: 3 * 1000,
          });
        }
      );
    } else if (val === "name") {
      await editGame({ GameID: game.game_id, GameName: newName.value }).then(
        (response) => {
          ElMessage({
            message: response.message || "Update description successfully!",
            type: "success",
            duration: 3 * 1000,
          });
        }
      );
    } else if (val === "time") {
      if (newExpectTime.value < 0) {
        ElMessage.error("Expected time can't be negative");
      } else {
        const timeInSec = Math.ceil(newExpectTime.value * 60 * 60);
        await editGame({ GameID: game.game_id, ExpectTime: timeInSec }).then(
          (response) => {
            ElMessage({
              message: response.message || "Update expect time successfully!",
              type: "success",
              duration: 3 * 1000,
            });
          }
        );
      }
    }
    // re capture data
    fetchNewData();
    fetchNewGameList();
  };

  const openUploader = (image) => {
    if (!editEnabled.value) {
      return;
    }
    info.value = image;
    showUploader.value = true;
  };
  // reset drawer
  const onReset = async (val) => {
    showUploader.value = val.content;

    fetchNewData();
    fetchNewGameList();
  };
  // delete screenshot handler
  const onDeleteScreenShot = (val) => {
    if (!editEnabled.value) {
      return;
    }
    deleteScreenShot({ Id: val }).then((response) => {
      ElMessage({
        message: response.message || "Delete screenshot successfully!",
        type: "success",
        duration: 3 * 1000,
      });
      fetchNewData();
    });
  //fetchNewData();
  };

  // handle delete tag
  const handleDelete = async (tag) => {
    await removeTag({ tagId: tag.TagID, gameId: game.game_id })
      .then((response) => {
        ElMessage({
          message: response.message || "Delete tag from game successfully!",
          type: "success",
          duration: 3 * 1000,
        });
        // delete from current
        allTags.value.splice(allTags.value.indexOf(tag), 1);
      })
      .catch((err) => {
        console.log("Error in remove tag from game:", err);
      });
  };

  function deteleTagFromRemote(tag) {
    if (
      tag.Name !== "Completed" &&
      tag.Name !== "Incompleted" &&
      tag.Name !== "Favourite"
    ) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this tag from remote? This tag will de deleted from all games!",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteTag({ id: tag.ID })
            .then((response) => {
              const defaultTagList = JSON.parse(
                JSON.stringify(defaultTags.value)
              );
              const defaultTagObj = defaultTagList.find(
                (obj) => obj.ID === tag.ID
              );
              if (Object.keys(allTags.value).length > 0) {
                const allTagList = JSON.parse(JSON.stringify(allTags.value));
                const allTagObj = allTagList.find((obj) => obj.TagID === tag.ID);
                allTagList.splice(allTagList.indexOf(allTagObj), 1);
                allTags.value = allTagList;
              }
              defaultTagList.splice(defaultTagList.indexOf(defaultTagObj), 1);
              defaultTags.value = defaultTagList;

              ElMessage({
                message:
                  response.message || "Delete tag from remote successfully!",
                type: "success",
                duration: 3 * 1000,
              });
            })
            .catch((err) => {
              console.log("Error in remove tag from remote:", err);
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Continue",
          });
        });
    } else {
      ElMessage.error("Default tag cannot be deleted");
    }
  }

  // tag input controller
  const toggleInput = () => {
    showTagInput.value = !showTagInput.value;
  };
  // handle add tag to game
  const addTagInGame = (tag) => {
    const tagList = JSON.parse(JSON.stringify(defaultTags.value));
    const tagObj = tagList.find((obj) => obj.Name === tag);
    console.log("tagObj:", tagObj);
    console.log("tag:", tag);
    addTagToGame({ tagId: tagObj.ID, gameId: game.game_id })
      .then((response) => {
        ElMessage({
          message: response.message || "Add Tag to Game Successfully!",
          type: "success",
          duration: 3 * 1000,
        });
        // update current allTags
        if (JSON.stringify(allTags.value) !== "{}") {
          allTags.value.push({ TagID: tagObj.ID, Name: tag });
        } else {
          allTags.value = [{ TagID: tagObj.ID, Name: tag }];
        }
        showTagInput.value = false;
      })
      .catch((err) => {
        console.log("Error in add tag to game:" + err);
        ElMessage.error("Something went wrong, please try again");
      });
  };

  // submit for adding games tag
  const handleInputConfirm = () => {
    const tagList = JSON.parse(JSON.stringify(tagInputValue.value));
    if (Object.keys(tagList).length > 0) {
      tagList.forEach((tag) => {
        const defaultTagList = JSON.parse(JSON.stringify(defaultTags.value));
        if (defaultTagList.find((obj) => obj.Name === tag)) {
          const currTags = JSON.parse(JSON.stringify(allTags.value));
          if (
            Object.keys(currTags).length > 0 &&
            currTags.find((obj) => obj.Name === tag)
          ) {
            ElMessage.info(
              "Tag " + tag + " already exist, repeated tags are not allowed"
            );
          } else {
            addTagInGame(tag);
          }
        } else {
          addTag({ TagName: tag })
            .then(() => {
              listTags().then((response) => {
                defaultTags.value = response.data;
                addTagInGame(tag);
              });
            })
            .catch((err) => {
              console.log("Error in add tag to game:", err);
              ElMessage.error("Something went wrong, please try again");
            });
        }
      });
      tagInputValue.value = [];
    } else {
      ElMessage.info(
        "Please choose a tag before clicking 'Done', no tag was added"
      );
      tagInputValue.value = [];
      toggleInput();
    }
  };

  // change rate value
  const onChangeRate = () => {
    if (!editEnabled.value) {
      return;
    }
    editGame({
      GameID: game.game_id,
      Rate: rateValue.value,
    }).then((response) => {
      ElMessage({
        message: response.message || "Change rate successfully!",
        type: "success",
        duration: 3 * 1000,
      });
    });
  };
  // delete game handler
  const onDeleteGame = () => {
    if (!editEnabled.value) {
      return;
    }
    ElMessageBox.confirm(
      "Are you sure you want to delete this game?",
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    )
      .then(() => {
        deleteGame({
          gameId: game.game_id,
        })
          .then((response) => {
            ElMessage({
              message: response.message || "Delete game successfully!",
              type: "success",
              duration: 3 * 1000,
            });
            router.push("/main");
          })
          .catch((error) => {
            console.log("Error in delete game:", error);
            ElMessage.error("Something went wrong, please try again");
          });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "Continue",
        });
      });
  };

  onMounted(async () => {
    //get data for all games
    await listGame()
      .then((response) => {
        if (JSON.stringify(response.data) !== "{}") {
          list.value = response.data;
          store.commit("layout/SET_GAME_LIST", response.data);
        }
        loadData.value = true;
      })
      .catch((error) => {
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
    // get data for the current game
    await gameDetails({
      gameId: route.params.id,
    })
      .then((response) => {
        if (JSON.stringify(response.data) !== "{}") {
          const Assign = new Promise((resolve) => {
            resolve(Object.assign(game, response.data));
          });

          Assign.then(() => {
            timeMins.value = (game.total_duration / 60).toFixed(2);
            timeHours.value = (timeMins.value / 60).toFixed(2);
            expectTime.value = (game.expected_time / 60 / 60).toFixed(2);
            loading.value = false;
            if (JSON.stringify(game.tag) !== "{}") {
              allTags.value = game.tag;
            }
            if (JSON.stringify(game.rate) !== "{}") {
              rateValue.value = game.rate;
            }
            console.log(game.records);
            for (let i = 0; i < game.records.length; i++) {
              if (game.records[i]["IsEnd"] === false) {
                start.value = false;
                console.log("check");
              }
            }
            getScreenShotNum();
          }).catch(() => {
            ElMessage.error("Oops something went wrong, please try again");
          });
        }
      })
      .catch((error) => {
        loading.value = false;
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
    // list all tags created by current user
    await listTags()
      .then((response) => {
        if (JSON.stringify(response.data) !== "[]") {
          defaultTags.value = response.data;
        }
      })
      .catch((error) => {
        loading.value = false;
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
  });

  // react to router params change and to reassign data to render
  const stop = watch(
    () => route.params,
    async (newParams) => {
      if (newParams.id && route.path.includes("/details")) {
        loading.value = true;
        if (newParams.id.length > 1) {
          await gameDetails({
            gameId: newParams.id,
          })
            .then((response) => {
              if (response.data) {
                const reAssign = new Promise((resolve) => {
                  resolve(Object.assign(game, response.data));
                });
                //reset all data containers
                reAssign
                  .then(() => {
                    loading.value = false;
                    allTags.value = game.tag;
                    tagInputValue.value = "";
                    newTagRef.value = null;
                    showTagInput.value = false;
                    text.value = "";
                    newName.value = "";
                    newExpectTime.value = 0;
                    expectTime.value = (game.expected_time / 60 / 60).toFixed(2);
                    timeMins.value = (game.total_duration / 60).toFixed(2);
                    timeHours.value = (timeMins.value / 60).toFixed(2);
                    start.value = true;
                    for (let i = 0; i < game.records.length; i++) {
                      if (game.records[i]["IsEnd"] === false) {
                        start.value = false;
                      }
                    }
                    getScreenShotNum();
                    if (game.rate) {
                      rateValue.value = game.rate;
                    } else {
                      rateValue.value = 0;
                    }
                  })
                  .catch(() => {
                    ElMessage.error(
                      "Oops something went wrong, please try again"
                    );
                  });
              }
            })
            .catch((error) => {
              console.log("Error:", error);
              ElMessage.error("Oops something went wrong, please try again");
            });
        }
      } else {
        stop();
      }
    },
    { immediate: true }
  );
</script>

<style lang="scss" scoped>
@import "@/styles/mainPage.scss";

.backimg img {
  width: 100%;
  height: var(--app-height);
  z-index: -20;
  position: fixed;
  opacity: 0.5;
  top: 0;
  left: 0;
  object-fit: cover;
  object-position: center;
}

.backcolor {
  width: 100%;
  height: var(--app-height);
  background-color: #333;
  opacity: 0.8;
  //z-index: -12;
  position: fixed;
  top: 0;
  left: 0;
}

.common-layout {
  position: relative;
  background-size: 100% 100%;
  z-index: 1;
  color: #fff;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-regular);

  .el-icon {
    margin-right: 10px;
    cursor: pointer;
  }
}

:deep(.el-input__wrapper) {
  height: 32px;
}

:deep(.el-select__tags) {
  height: 100%;
  margin-left: 5px;
}

:deep(.el-select-tags-wrapper) {
  margin-top: 1px;
  height: calc(100% - 2px);
  overflow: auto;
}

.el-main {
  margin-left: 30px;
  overflow-x: hidden;
}

.el-container {
  height: var(--app-height);
  padding-bottom: 40px;
}

:deep(.datePicker) {
  height: 50%;
  width: auto;
}

.main_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .main_header_left {
    display: flex;

    .main_header_left_text {
      padding-right: 20px;

      div:last-child {
        font-size: 10px;
        color: #ccc;
      }
    }
  }

  .main_header_right {
    width: auto;
    display: flex;

    .line {
      margin-left: 10px;
      height: 30px;
      width: 2px;
      background-color: #ccc;
    }

    .main_header_right_icon {
      margin-left: 10px;
      display: flex;

      div:first-child {
        margin-right: 10px;
      }
    }
  }
}

// Game details

.game_name {
  width: 500px;
}
.description {
  margin-top: 32px !important;
  overflow-y: auto;
  height: 50px;
  @media screen and (max-width: 960px) {
    margin-top: 0px !important;
  }
}

.is-guttered {
  min-width: 200px;
  padding-left: 0px;
}
.detailtitle {
  margin-top: 10px;
  // background-color: red;
  height: 500px;
  margin-bottom: 40px;

  .detailtitle_cover {
    border: 1px solid transparent;
    position: relative;
  }

  .playbutton {
    position: absolute;
    display: none;
    top: 50%;
    left: 35%;
  }

  .detailtitle_:hover {
    img {
      opacity: 0.6;
    }

    border: 1px solid #e6a23c;

    .playbutton {
      display: block;
    }
  }

  .detail_img {
    width: 100%;
    margin-right: 30px;
  }

  .detailtitle_right {
    margin-left: 10px;
  }

  .detail_name {
    font-size: 28px;
    margin-bottom: 10px;
    color: #fff;
  }

  .detail_time {
    margin-bottom: 30px;
    display: inline-block;
    margin-top: 15px;

    .detail_time_list {
      margin-right: 20px;
      width: 60px;
      height: 25px;
      border-radius: 5px;
      background-color: rgba($color: #888, $alpha: 0.5);
      text-align: center;
      color: #fff;
    }
  }

  .play {
    display: flex;
    margin-right: 100px;
    @media screen and (max-width: 960px) {
      display: inline-block;
    }

    .play_icon {
      width: 40px;
      height: 25px;
      background-color: rgba($color: #000000, $alpha: 0.5);
      text-align: center;
      margin-left: 20px;
      border-radius: 5px;
      padding-top: 10px;
    }

    .play_icon:hover {
      background-color: #888;
    }

    .play_icon_star {
      margin-left: 20px;
      @media screen and (max-width: 960px) {
        margin-left: 0px;
      }
    }
  }

  .detail_content {
    margin-top: 50px;
    font-size: 18px;
    margin-bottom: 20px;
  }

  .filmmaker {
    margin-top: 50px;
    display: flex;

    div:first-child {
      margin-right: 50px;
    }

    .filmmaker_list {
      margin-bottom: 10px;
      display: flex;

      .filmmaker_list_one {
        color: #888;
        margin-right: 50px;
        width: 80px;
      }

      div:last-child {
        width: 300px;
      }
    }
  }
}

//Screenshot list
.screenshotlist {
  margin-top: 150px;

  .screenshotlist_title {
    padding-top: 50px;
    margin-bottom: 30px;
  }

  .screenshotcontent {
    // display: flex;
    overflow: auto;
    height: 10rem;
    .el-col {
      margin: 0 12rem 0 0;
    }

    .screenshotcontent_list {
      // width: 200px;
      text-align: center;

      .screenshotname {
        margin: auto;
        // width: 150px;
        // height: 100px;
      }
    }

    .screenshotphoto {
      img {
        width: 16rem;
        height: 9rem;
        border: 1px solid transparent;
        object-fit: cover;
        object-position: center;
        margin-bottom: 10px;
      }
    }

    .screenshotphoto:hover {
      img {
        border: 1px solid #e6a23c;
      }
    }
  }
}

.deleteBtn:hover {
  color: #489cfc;
}

.routerLink {
  text-decoration: none;
  color: #213547;
}

:deep(.el-input__inner) {
  min-width: 20px;
}
</style>
