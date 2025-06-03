import {useCustomMutation} from "@refinedev/core";
import {useCallback} from "react";

interface MarkAsArchivedVariables {
  notice: string
  student: string
  archived: boolean
}

const useMarkAsArchived = () => {
  const {mutate, mutateAsync, ...mutationObjs} = useCustomMutation({
    mutationOptions: {}
  })
  const mutationFunction = useCallback((variables: MarkAsArchivedVariables) => {
    return mutate({
      url: '/api/method/unity_parent_app.api.notices.mark_as_archived',
      method: 'post',
      values: variables
    })
  }, [mutate])
  const mutationAsyncFunction = useCallback((variables: MarkAsArchivedVariables) => {
    return mutateAsync({
      url: '/api/method/unity_parent_app.api.notices.mark_as_archived',
      method: 'post',
      values: variables
    })
  }, [mutateAsync])
  return {
    ...mutationObjs,
    mutate: mutationFunction,
    mutateAsync: mutationAsyncFunction
  }
}

export default useMarkAsArchived
