import { useSignal } from "@preact/signals";
import { useCallback, useRef, useEffect } from "preact/hooks";

export default function VideoGenerator() {
  const tweetId = useSignal("");
  const duration = useSignal(9);
  const outputType = useSignal("tweet");
  const includeAudio = useSignal(true);
  const isGenerating = useSignal(false);
  const logs = useSignal<string[]>([]);
  const isComplete = useSignal(false);
  const isSuccess = useSignal(false);
  const generatedFilename = useSignal("");
  const availableVideos = useSignal<string[]>([]);
  const showVideoList = useSignal(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useSignal(true);
  const isFullScreen = useSignal(false);

  const clearLogs = useCallback(() => {
    logs.value = [];
    isComplete.value = false;
    isSuccess.value = false;
    generatedFilename.value = "";
    showVideoList.value = false;
    shouldAutoScroll.value = true;
  }, []);

  const toggleFullScreen = useCallback(() => {
    isFullScreen.value = !isFullScreen.value;
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (shouldAutoScroll.value && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs.value]);

  // Handle manual scroll to disable auto-scroll
  const handleScroll = useCallback(() => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      shouldAutoScroll.value = isAtBottom;
    }
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      shouldAutoScroll.value = true;
    }
  }, []);

  const loadAvailableVideos = useCallback(async () => {
    try {
      const response = await fetch("/api/list-videos");
      if (response.ok) {
        const data = await response.json();
        availableVideos.value = data.files || [];
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
  }, []);

  const handleSubmit = useCallback(async () => {

    // Reset state
    isGenerating.value = true;
    logs.value = [];
    isComplete.value = false;
    isSuccess.value = false;
    generatedFilename.value = "";

    try {
      const formData = new FormData();
      formData.append("tweetId", tweetId.value);
      formData.append("duration", duration.value.toString());
      formData.append("outputType", outputType.value);
      formData.append("includeAudio", includeAudio.value.toString());

      const response = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'log') {
                logs.value = [...logs.value, data.message];
              } else if (data.type === 'complete') {
                isComplete.value = true;
                isSuccess.value = data.success;
                if (data.success) {
                  logs.value = [...logs.value, "✅ " + data.message];
                  if (data.filename) {
                    generatedFilename.value = data.filename;
                    // Automatically download the video
                    setTimeout(() => {
                      const downloadUrl = `/api/download-video?filename=${encodeURIComponent(data.filename)}`;
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = data.filename;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, 1000); // Small delay to ensure the file is ready
                    // Refresh the video list
                    loadAvailableVideos();
                  }
                } else {
                  logs.value = [...logs.value, "❌ " + data.message];
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      logs.value = [...logs.value, `❌ Error: ${error.message}`];
      isComplete.value = true;
      isSuccess.value = false;
    } finally {
      isGenerating.value = false;
    }
  }, [tweetId.value, duration.value, outputType.value, includeAudio.value]);

  return (
    <div class={`${isFullScreen.value ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900 flex items-center justify-center ${isFullScreen.value ? 'p-0' : 'p-2 sm:p-4'} relative overflow-hidden`}>
      {/* Animated gradient overlay */}
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      {/* Floating orbs */}
      <div class="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-bounce"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-spin"></div>
      
      {/* Full Screen Toggle Button */}
      <button
        onClick={toggleFullScreen}
        class="absolute top-4 right-4 z-20 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        title={isFullScreen.value ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullScreen.value ? (
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
        )}
      </button>

      <div class={`w-full ${isFullScreen.value ? 'h-full max-w-none' : 'max-w-4xl'} relative z-10`}>
        <div class={`bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 ${isFullScreen.value ? 'h-full m-0 rounded-none' : 'p-4 sm:p-6 lg:p-8'}`}>
          {/* Header - Only show when not in logs mode */}
          {!isGenerating.value && logs.value.length === 0 && (
            <div class="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Video Generator</h1>
              <p class="text-gray-400 text-sm sm:text-base">Create videos from your content</p>
            </div>
          )}

          {/* Form - Hidden when logs are present */}
          {!isGenerating.value && logs.value.length === 0 && (
            <>
            <form onSubmit={handleSubmit} class="space-y-4 sm:space-y-6">
            {/* Tweet ID Input */}
            <div>
              <label for="tweetId" class="block text-sm font-medium text-gray-300 mb-2">
                Tweet ID
              </label>
              <input
                type="text"
                id="tweetId"
                value={tweetId.value}
                onInput={(e) => tweetId.value = (e.target as HTMLInputElement).value}
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 hover:bg-gray-600 text-sm sm:text-base"
                placeholder="Enter tweet ID..."
                required
              />
            </div>

            {/* Duration Input */}
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-300 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                value={duration.value}
                onInput={(e) => duration.value = parseInt((e.target as HTMLInputElement).value)}
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 text-sm sm:text-base"
                min="1"
                max="60"
                required
              />
            </div>

            {/* Output Type Select */}
            <div>
              <label for="outputType" class="block text-sm font-medium text-gray-300 mb-2">
                Output Type
              </label>
              <select
                id="outputType"
                value={outputType.value}
                onChange={(e) => outputType.value = (e.target as HTMLSelectElement).value}
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 text-sm sm:text-base"
              >
                <option value="tweet">Tweet</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Audio Toggle */}
            <div class="flex items-center justify-between">
              <label for="includeAudio" class="text-sm font-medium text-gray-300">
                Include Audio
              </label>
              <button
                type="button"
                onClick={() => includeAudio.value = !includeAudio.value}
                class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  includeAudio.value ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    includeAudio.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating.value}
              class={`w-full font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transform transition-all duration-200 shadow-lg text-sm sm:text-base ${
                isGenerating.value
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isGenerating.value ? 'Generating...' : 'Generate Video'}
            </button>
          </form>
          
          {/* Video List Section */}
          <div class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-white">Available Videos</h3>
              <button
                onClick={() => {
                  showVideoList.value = !showVideoList.value;
                  if (showVideoList.value) {
                    loadAvailableVideos();
                  }
                }}
                class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                {showVideoList.value ? 'Hide Videos' : 'Show Videos'}
              </button>
            </div>
            
            {showVideoList.value && (
              <div class="bg-gray-900/80 rounded-lg p-4">
                {availableVideos.value.length === 0 ? (
                  <p class="text-gray-400 text-center">No videos found</p>
                ) : (
                  <div class="space-y-2">
                    {availableVideos.value.map((filename) => (
                      <div key={filename} class="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span class="text-gray-300 font-mono text-sm">{filename}</span>
                        <button
                          onClick={() => {
                            const downloadUrl = `/api/download-video?filename=${encodeURIComponent(filename)}`;
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-200 hover:scale-105"
                        >
                          📥 Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          </>
          )}

          {/* Logs Section - Zen Mode */}
          {(isGenerating.value || logs.value.length > 0) && (
            <div class={isGenerating.value || logs.value.length > 0 ? "" : "mt-6"}>
              {/* Back to Form Button */}
              <div class="mb-4 flex justify-between items-center">
                <h3 class="text-base sm:text-lg font-semibold text-white">Generation Logs</h3>
                <button
                  onClick={clearLogs}
                  disabled={isGenerating.value}
                  class={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isGenerating.value
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  }`}
                >
                  Back to Form
                </button>
              </div>
              
              <div class="relative">
                <div 
                  ref={logsContainerRef}
                  onScroll={handleScroll}
                  class={`bg-gray-900/80 rounded-lg p-3 sm:p-4 lg:p-6 overflow-y-auto ${isFullScreen.value ? 'h-[calc(100vh-120px)]' : 'max-h-96'}`}
                >
                  {logs.value.length === 0 ? (
                    <div class="text-gray-400 text-center py-4">
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      Starting video generation...
                    </div>
                  ) : (
                    <div class="space-y-2">
                      {logs.value.map((log, index) => (
                        <div key={index} class="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isComplete.value && (
                    <div class={`mt-4 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base ${
                      isSuccess.value 
                        ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                        : 'bg-red-900/30 border border-red-500/30 text-red-300'
                    }`}>
                      {isSuccess.value ? '✅ ' : '❌ '}
                      {isSuccess.value ? 'Video generation completed successfully!' : 'Video generation failed. Check the logs above for details.'}
                      
                      {isSuccess.value && generatedFilename.value && (
                        <div class="mt-3">
                          <button
                            onClick={() => {
                              const downloadUrl = `/api/download-video?filename=${encodeURIComponent(generatedFilename.value)}`;
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.download = generatedFilename.value;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                          >
                            📥 Download Video
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Scroll to bottom button */}
                {!shouldAutoScroll.value && logs.value.length > 0 && (
                  <button
                    onClick={scrollToBottom}
                    class="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    title="Scroll to bottom"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 